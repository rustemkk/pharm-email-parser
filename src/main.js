const imaps = require('imap-simple');
const iconv = require('iconv-lite');
const mimelib = require('mimelib');
const fs = require('fs');

const config = require('./config');
const print = require('./utils');


print('Парсер накладных запущен!');

const fetchInvoices = () => {
    let result = '';
    let chain = Promise.resolve();

    config.providers.forEach((provider) => {
        chain = chain
            .then(() => {
                return new Promise((resolve, reject) => {
                    fs.access(provider.path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                        return err ?
                            reject(err) :
                            resolve(provider.path);
                    });
                }).then((path) => {
                    return new Promise((resolve, reject) => {
                        fs.readdir(path, (err, files) => {
                            if (err) {
                                reject(err);
                            } else {
                                files = files.filter(i => !config.excludeFilesAndFolders.has(i));
                                if (files.length > 0)
                                    result += provider.name + ': ' + files.length + '; ';
                                resolve();
                            }
                        })
                    });
                }).catch((err) => {
                    print(err.message);
                });
            });
    });
    chain = chain
        .then(() => {
            print(result.length > 0 ?
                'Не импортированные: ' + result :
                'Не ипортированных накладных нет :)');
        });
};


const fetchEmails = () => {
    imaps.connect(config)
        .then((connection) => {
            print('Начинаю обрабатывать почтовый ящик..');
            return connection.openBox('INBOX')
                .then(() => {
                    return connection.search(['ALL'], {bodies: ['HEADER', 'TEXT'], struct: true});
                })
                .then((messages) => {
                    print(messages.length + " писем обнаружено, обрабатываю..");
                    let emails = [];
                    messages.forEach((message) => {
                        let emailUid = message.attributes.uid;

                        let header = message.parts.filter(function (part) {
                            return part.which === 'HEADER';
                        })[0].body;

                        let {from: [emailFrom], subject: [emailSubject]} = header;
                        emailFrom = emailFrom.match(/[a-zA-Z_.0-9]+@[a-zA-Z_.0-9]+.[a-z]+/)[0];

                        let text = message.parts.filter(function (part) {
                            return part.which === 'TEXT';
                        })[0].body;

                        let emailText = text.match(/Content-Transfer-Encoding: base64[\s]*([0-9a-zA-Z/+\s=]*)[\s]*--------/m);
                        emailText = emailText && mimelib.decodeBase64(emailText[1]);

                        if (!config.providers.has(emailFrom)
                            || !config.excludeFromSubject.every(e => !emailSubject.includes(e)))
                            return;

                        let parts = imaps.getParts(message.attributes.struct);
                        emails = emails.concat(
                            parts.filter(function (part) {
                                return part.disposition
                                    && part.disposition.type.toUpperCase() === 'ATTACHMENT';
                            }).map(function (part) {
                                return connection.getPartData(message, part)
                                    .then(function (partData) {
                                        return {
                                            emailUid,
                                            emailFrom,
                                            emailSubject,
                                            emailText,
                                            attachment: {
                                                filename: mimelib.decodeMimeWord(part.disposition.params.filename),
                                                data: partData
                                            }
                                        };
                                    });
                            })
                        );
                    });
                    return Promise.all(emails);
                })
                .then((emails) => {
                    print(emails.length > 0 ?
                        emails.length + ' писем с накладными обнаружено, обрабатываю..' :
                        'Писем с накладными не обнаружено :)'
                    );
                    let chain = Promise.resolve();
                    emails.forEach(email => {
                        let provider = config.providers.get(email.emailFrom);
                        let fileData = email.attachment.data;

                        fileData = provider.fileEncodingFrom ?
                            iconv.decode(fileData, provider.fileEncodingFrom) :
                            fileData;

                        if (provider.replacementsBySubject) {
                            let {replacementsBySubject} = provider;
                            for (let address of replacementsBySubject.keys()) {
                                if (email.emailSubject.includes(address)) {
                                    fileData = fileData.replace(replacementsBySubject.get(address).from, replacementsBySubject.get(address).to);
                                }
                            }
                        }

                        if (provider.replacementsByText) {
                            let {replacementsByText} = provider;
                            for (let address of replacementsByText.keys()) {
                                if (email.emailText.includes(address)) {
                                    fileData = fileData.replace(replacementsByText.get(address).from, replacementsByText.get(address).to);
                                }
                            }
                        }

                        fileData = provider.fileEncodingTo ?
                            iconv.encode(fileData, provider.fileEncodingTo) :
                            fileData;

                        chain = chain
                            .then(() => {
                                return new Promise((resolve, reject) => {
                                    fs.writeFile(provider.path + '/' + email.attachment.filename, fileData, function (err) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            print('Сохранил накладную: ' + provider.path + '/' + email.attachment.filename);
                                            resolve();
                                        }
                                    });
                                })
                            })
                            .then(() => {
                                return connection.addFlags(email.emailUid, '\\Seen');
                            })
                            .then(() => {
                                print('Перенес письмо от ' + email.emailFrom + ' в папку PARSED.');
                                return connection.moveMessage(email.emailUid, 'PARSED');
                            });
                    });
                    return chain;
                })
                .then(() => {
                    connection.end();
                })
                .catch((err) =>
                    print(err)
                );
        });
};

setInterval(
    fetchInvoices,
    30000
);

setInterval(
    fetchEmails,
    300000
);

fetchEmails();