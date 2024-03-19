// import {faker} from '@faker-js/faker'

// export const reportsData = Array.from({length: Math.ceil(Math.random() * 10)}, () => ({
//   total: faker.number.int({min: 100, max: 400}),
//   answered: faker.number.int({min: 50, max: 100}),
//   skipped: faker.number.int({min: 5, max: 20}),
//   question: faker.lorem.sentence(),
//   answers: Array.from({length: Math.ceil(Math.random() * 10)}, () => ({
//     choise: faker.lorem.sentence(),
//     responses: {
//       percent: faker.number.float({min: 1, max: 50, precision: 0.1}),
//       total: faker.number.int({min: 1, max: 50}),
//     },
//   })),
// }))

export const reportsData = {
  questions: [
    {
      id: '155294493',
      description:
        '¿Con qué frecuencia los candidatos políticos locales hacen lo que la gente como usted quiere que hagan?',
      answers: [
        {
          id: '1141593198',
          description: 'Siempre',
          count: 3,
        },
        {
          id: '1141593199',
          description: 'La mayor parte del tiempo',
          count: 3,
        },
        {
          id: '1141593200',
          description: 'Cerca de la mitad del tiempo',
          count: 2,
        },
        {
          id: '1141593201',
          description: 'De vez en cuando',
          count: 0,
        },
        {
          id: '1141593202',
          description: 'Nunca',
          count: 1,
        },
      ],
      stats: {
        min: 1,
        max: 5,
        mean: 2.2222222222222223,
        median: 2,
        std: 1.227262335243029,
      },
    },
    {
      id: '155294494',
      description: '¿Actualmente recibe beneficios del Seguridad Social para todos?',
      answers: [
        {
          id: '1141593203',
          description: 'Sí, los recibo',
          count: 8,
        },
        {
          id: '1141593204',
          description: 'No, no los recibo',
          count: 1,
        },
      ],
      stats: {
        min: 1,
        max: 2,
        mean: 1.1111111111111112,
        median: 1,
        std: 0.3142696805273545,
      },
    },
    {
      id: '155294495',
      description:
        '¿Qué tanto pueden las personas como usted influir en lo que hace el gobierno local?',
      answers: [
        {
          id: '1141593205',
          description: 'Absolutamente',
          count: 2,
        },
        {
          id: '1141593206',
          description: 'Mucho',
          count: 5,
        },
        {
          id: '1141593207',
          description: 'Moderadamente',
          count: 1,
        },
        {
          id: '1141593208',
          description: 'Un poco',
          count: 1,
        },
        {
          id: '1141593209',
          description: 'Nada en absoluto',
          count: 0,
        },
      ],
      stats: {
        min: 1,
        max: 4,
        mean: 2.111111111111111,
        median: 2,
        std: 0.8748897637790901,
      },
    },
    {
      id: '155294496',
      description: '¿Alguna persona de su hogar actualmente recibe vales de comida?',
      answers: [
        {
          id: '1141593210',
          description: 'Sí, alguien los recibe',
          count: 5,
        },
        {
          id: '1141593211',
          description: 'No, nadie los recibe',
          count: 3,
        },
      ],
      stats: {
        min: 1,
        max: 2,
        mean: 1.375,
        median: 1,
        std: 0.4841229182759271,
      },
    },
    {
      id: '155294497',
      description:
        '¿Con qué frecuencia los candidatos políticos nacionales hacen lo que la gente como usted quiere que hagan?',
      answers: [
        {
          id: '1141593212',
          description: 'Siempre',
          count: 1,
        },
        {
          id: '1141593213',
          description: 'La mayor parte del tiempo',
          count: 3,
        },
        {
          id: '1141593214',
          description: 'Cerca de la mitad del tiempo',
          count: 3,
        },
        {
          id: '1141593215',
          description: 'De vez en cuando',
          count: 1,
        },
        {
          id: '1141593216',
          description: 'Nunca',
          count: 1,
        },
      ],
      stats: {
        min: 1,
        max: 5,
        mean: 2.7777777777777777,
        median: 3,
        std: 1.1331154474650633,
      },
    },
    {
      id: '155294498',
      description: '¿Qué tan interesado/a está usted en la política local?',
      answers: [
        {
          id: '1141593217',
          description: 'Extremadamente interesado/a',
          count: 5,
        },
        {
          id: '1141593218',
          description: 'Muy interesado/a',
          count: 1,
        },
        {
          id: '1141593219',
          description: 'Moderadamente interesado/a',
          count: 3,
        },
        {
          id: '1141593220',
          description: 'Un poco interesado/a',
          count: 0,
        },
        {
          id: '1141593221',
          description: 'Nada interesado/a',
          count: 0,
        },
      ],
      stats: {
        min: 1,
        max: 3,
        mean: 1.7777777777777777,
        median: 1,
        std: 0.9162456945817024,
      },
    },
    {
      id: '155294499',
      description:
        '¿Qué tanto cree usted que el gobierno local se preocupa por lo que piensan las personas como usted?',
      answers: [
        {
          id: '1141593222',
          description: 'Absolutamente',
          count: 4,
        },
        {
          id: '1141593223',
          description: 'Mucho',
          count: 4,
        },
        {
          id: '1141593224',
          description: 'Moderadamente',
          count: 0,
        },
        {
          id: '1141593225',
          description: 'Un poco',
          count: 0,
        },
        {
          id: '1141593226',
          description: 'Nada en absoluto',
          count: 1,
        },
      ],
      stats: {
        min: 1,
        max: 5,
        mean: 1.8888888888888888,
        median: 2,
        std: 1.1967032904743342,
      },
    },
    {
      id: '155294500',
      description: '¿Qué tan probable cree que sea que nuestra próxima presidente sea mujer?',
      answers: [
        {
          id: '1141593227',
          description: 'Extremadamente probable',
          count: 4,
        },
        {
          id: '1141593228',
          description: 'Muy probable',
          count: 2,
        },
        {
          id: '1141593229',
          description: 'Algo probable',
          count: 2,
        },
        {
          id: '1141593230',
          description: 'No tan probable',
          count: 1,
        },
        {
          id: '1141593231',
          description: 'Nada probable',
          count: 0,
        },
      ],
      stats: {
        min: 1,
        max: 4,
        mean: 2,
        median: 2,
        std: 1.0540925533894598,
      },
    },
    {
      id: '155294501',
      description:
        '¿El gobierno de México está gastando demasiado, demasiado poco o la cantidad apropiada de dinero tratando de reducir el calentamiento global?',
      answers: [
        {
          id: '1141593232',
          description: 'Demasiado',
          count: 1,
        },
        {
          id: '1141593233',
          description: 'En cierta medida demasiado',
          count: 3,
        },
        {
          id: '1141593234',
          description: 'Lo apropiado',
          count: 2,
        },
        {
          id: '1141593235',
          description: 'En cierta medida poco',
          count: 2,
        },
        {
          id: '1141593236',
          description: 'Demasiado poco',
          count: 1,
        },
      ],
      stats: {
        min: 1,
        max: 5,
        mean: 2.888888888888889,
        median: 3,
        std: 1.1967032904743342,
      },
    },
    {
      id: '155294502',
      description:
        '¿Con qué frecuencia el gobierno nacional hace lo que la gente como usted quiere?',
      answers: [
        {
          id: '1141593237',
          description: 'Siempre',
          count: 2,
        },
        {
          id: '1141593238',
          description: 'La mayor parte del tiempo',
          count: 4,
        },
        {
          id: '1141593239',
          description: 'Cerca de la mitad del tiempo',
          count: 2,
        },
        {
          id: '1141593240',
          description: 'De vez en cuando',
          count: 0,
        },
        {
          id: '1141593241',
          description: 'Nunca',
          count: 1,
        },
      ],
      stats: {
        min: 1,
        max: 5,
        mean: 2.3333333333333335,
        median: 2,
        std: 1.1547005383792515,
      },
    },
  ],
}
