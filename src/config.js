let mainPath = "D:\\eFarma2\\Nakl\\";

// let mainPath = '/Users/rustemk/Dropbox/Programming/JavaScript/pharmParser/Nakl/';
// let mainPath = "C:\\Dropbox\\Programming\\JavaScript\\pharm-parser\\Nakl\\";

let config = {
    imap: {
        user: "example@yandex.ru",
        password: "password",
        host: "imap.yandex.ru",
        port: 993,
        tls: true,
        authTimeout: 3000
    },
    providers: new Map(
        [
            ['edata@ufa.katren.ru', {
                path: mainPath + 'Катрен',
                name: 'Катрен',
                fileEncodingFrom: 'win1251',
                fileEncodingTo: 'win1251',
                replacementsBySubject: new Map([
                    ['Волгоградская, 9', {
                        from: '<Грузополучатель>БЕЛЕБЕЙ,  ИП *Исламуратова К.Ф*</Грузополучатель>',
                        to: '<Грузополучатель>БЕЛЕБЕЙ,  ИП *Исламуратова К.Ф* (Волгоградская, 9)</Грузополучатель>'
                    }],
                    ['Волгоградская, 16', {
                        from: '<Грузополучатель>БЕЛЕБЕЙ, ИП *ИСЛАМУРАТОВ М.М.*</Грузополучатель>',
                        to: '<Грузополучатель>БЕЛЕБЕЙ, ИП *ИСЛАМУРАТОВ М.М.* (Волгоградская, 16)</Грузополучатель>'
                    }],
                    ['Красная, 81', {
                        from: '<Грузополучатель>БЕЛЕБЕЙ,  ИП *Исламуратова К.Ф*</Грузополучатель>',
                        to: '<Грузополучатель>БЕЛЕБЕЙ,  ИП *Исламуратова К.Ф* (Красная, 81)</Грузополучатель>'
                    }],
                    ['Красная, 114', {
                        from: '<Грузополучатель>БЕЛЕБЕЙ,  ИП *Исламуратова К.Ф*</Грузополучатель>',
                        to: '<Грузополучатель>БЕЛЕБЕЙ,  ИП *Исламуратова К.Ф* (Красная, 114)</Грузополучатель>'
                    }]
                ])
            }],
            ['invoice.kaz@west.rostagroup.ru', {
                path: mainPath + 'Роста',
                name: 'Роста'
            }],
            ['data@agrores.ru', {
                path: mainPath + 'Агроресурсы',
                name: 'Агроресурсы'
            }],
            ['nikznik@yandex.ru', {
                path: mainPath + 'Паллада-ПИ',
                name: 'Паллада-ПИ',
                fileEncodingFrom: 'utf8',
                replacementsByText: new Map([
                    ['Волгоградская ,9', {
                        from: '<Грузополучатель>Исламуратова К.Ф. ИП</Грузополучатель>',
                        to: '<Грузополучатель>Исламуратова К.Ф. ИП (Волгоградская, 9)</Грузополучатель>'
                    }],
                    ['Волгоградская, 16', {
                        from: '<Грузополучатель>Исламуратова К.Ф. ИП</Грузополучатель>',
                        to: '<Грузополучатель>Исламуратова К.Ф. ИП (Волгоградская, 16)</Грузополучатель>'
                    }],
                    ['Красная, 81', {
                        from: '<Грузополучатель>Исламуратова К.Ф. ИП</Грузополучатель>',
                        to: '<Грузополучатель>Исламуратова К.Ф. ИП (Красная, 81)</Грузополучатель>'
                    }],
                    ['Красная, 114', {
                        from: '<Грузополучатель>Исламуратова К.Ф. ИП</Грузополучатель>',
                        to: '<Грузополучатель>Исламуратова К.Ф. ИП (Красная, 114)</Грузополучатель>'
                    }]
                ])
            }],
            ['info@ufa.forafarm.ru', {
                path: mainPath + 'Фора-фарм',
                name: 'Фора-фарм'
            }],
            ['obmen.biofarm@yandex.ru', {
                path: mainPath + 'Биофарм',
                name: 'Биофарм'
            }],
            ['1', {
                path: mainPath + 'Протек',
                name: 'Протек'
            }],
            ['2', {
                path: mainPath + 'ООО П У Л Ь С',
                name: 'Пульс'
            }],
            ['3', {
                path: mainPath + 'Б С С Оренбург',
                name: 'БСС'
            }],
            ['4', {
                path: mainPath + 'годовалов',
                name: 'Годовалов'
            }],
            ['5', {
                path: mainPath + 'Сиа',
                name: 'Сиа'
            }]
        ]
    ),
    excludeFromSubject: [
        'APTEKA.RU',
        'Отказ',
        'отказ',
        'Otkaz',
        'Фактуры'
    ],
    excludeFilesAndFolders: new Set([
        'deleted',
        'old',
        'K_43948.dbf',
        'K_88373.dbf',
        'K_263490.dbf',
        'Письмо на возврат препарата.doc',
        'SbisPlugin.exe',
        '9620317.txt',
        '55751.dbf',
        'invoice_71244139-001.xml',
        'invoice_49130000-001.xml',
        'invoice_60833995-001.xml',
        'invoice_52675896-001.xml',
        'invoice_53109951-001.xml',
        'invoice_59742066-001.xml',
        'invoice_63309535-001.xml',
        'invoice_62170725-001.xml',
        'invoice_62085727-001.xml',
        'invoice_62092011-001.xml',
        'invoice_62086950-001.xml',
        'invoice_62092265-001.xml',
        'invoice_62076036-001.xml',
        'invoice_60271856-001.xml',
        'invoice_60026349-001.xml',
        'invoice_60026066-001.xml',
        'invoice_58878434-002.xml',
        'invoice_58852338-001.xml',
        'invoice_58878434-001.xml',
        'invoice_58896682-001.xml',
        'invoice_58849267-001.xml',
        'invoice_58897594-001.xml',
        'invoice_58738637-001.xml',
        'invoice_58781455-001.xml',
        'invoice_58773710-001.xml',
        'invoice_58767708-001.xml',
        'invoice_58786125-001.xml',
        'invoice_58744389-001.xml',
        'template',
        'invoice_11108-Q9762.xml',
        'invoice_12701-Q0029.xml',
        'invoice_12701-Q0605.xml',
        'invoice_12701-Q2116.xml',
        'invoice_12701-Q2119.xml',
        'invoice_12701-Q2434.xml',
        'invoice_12701-Q2513.xml',
        'invoice_12701-Q9852.xml',
        'УТ000019934.sst',
        'Т000033245.xml',
        'webinar-screensharing-win-4.2.8.msi',
        'bifit_signer_1.6.0.7.exe',
        '00014768.dbf'
    ])
};

module.exports = config;