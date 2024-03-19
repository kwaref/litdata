export const regularGraphOptions = {
  indexAxis: 'y' as const,
  maintainAspectRatio: false,
  barThickness: 15,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      padding: {
        top: 8,
        bottom: 10,
        left: 15,
        right: 15,
      },
      bodySpacing: 8,
      boxWidth: 9,
      boxHeight: 9,
      boxPadding: 6,
      bodyFont: {
        size: 12,
      },
      backgroundColor: function ({tooltip}: any) {
        return '#00002D'
      },
      callbacks: {
        labelColor: (ctx: any) => ({
          borderColor: ctx.dataset.backgroundColor[ctx?.dataIndex],
          backgroundColor: '#00002D',
          borderWidth: 3,
          borderRadius: 4.5,
        }),
        labelTextColor: () => '#fff',
        label: (ctx: any) => {
          return `${ctx.formattedValue}% | ${ctx.dataset.counts[ctx?.dataIndex]}`
        },
      },
    },
  },
  scales: {
    x: {
      barPercentage: 0.4,
      ticks: {
        callback: (value: any) => value + '%',
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
}

export const regularGraphFixedXBarsOptions = {
  indexAxis: 'y' as const,
  maintainAspectRatio: false,
  barThickness: 18,
  layout: {
    padding: {
      right: 23,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      padding: {
        top: 8,
        bottom: 10,
        left: 15,
        right: 15,
      },
      bodySpacing: 8,
      boxWidth: 9,
      boxHeight: 9,
      boxPadding: 6,
      bodyFont: {
        size: 12,
      },
      backgroundColor: () => {
        return '#00002D'
      },
      callbacks: {
        labelColor: (ctx: any) => ({
          borderColor: ctx.dataset.backgroundColor[ctx?.dataIndex],
          backgroundColor: '#00002D',
          borderWidth: 3,
          borderRadius: 4.5,
        }),
        labelTextColor: () => '#fff',
        label: (ctx: any) => {
          return `${ctx.formattedValue}% | ${ctx.dataset.counts[ctx.dataIndex]}`
        },
      },
    },
  },
  scales: {
    x: {
      barPercentage: 0.4,
      grid: {
        drawTicks: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      afterFit: (context: any) => {
        context.width += 18.671875
      },
    },
  },
}

export const regularGraphFixedXAxisXOptions = {
  indexAxis: 'y' as const,
  maintainAspectRatio: false,
  barThickness: 15,
  layout: {
    padding: {
      right: 27,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      barPercentage: 0.4,
      ticks: {
        callback: (value: any) => value + '%',
      },
      afterFit: (context: {height: number}) => {
        context.height += 30
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      afterFit: (context: any) => {
        context.width += 18.671875
      },
    },
  },
}

export const trendingGraphOptions = {
  maintainAspectRatio: false,
  barThickness: 20,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      padding: {
        top: 8,
        bottom: 10,
        left: 15,
        right: 15,
      },
      bodySpacing: 8,
      boxWidth: 9,
      boxHeight: 9,
      boxPadding: 6,
      bodyFont: {
        size: 12,
      },
      backgroundColor: function ({tooltip}: any) {
        return '#00002D'
      },
      callbacks: {
        labelColor: (ctx: any) => ({
          borderColor: ctx.dataset?.backgroundColor,
          backgroundColor: '#00002D',
          borderWidth: 3,
          borderRadius: 4.5,
        }),
        labelTextColor: () => '#fff',
        label: (ctx: any) => `${ctx?.formattedValue}% | ${ctx.dataset?.counts[ctx?.dataIndex]}`,
        title: (ctx: any) => ctx[0]?.dataset?.label,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      barPercentage: 0.4,
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
      categoryPercentage: 0.9,
    },
    y: {
      stacked: true,
      ticks: {
        padding: 20,
        callback: (value: any) => value + '%',
      },
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
}

export const trendingGraphFixedYBarsOptions = {
  maintainAspectRatio: false,
  barThickness: 20,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      padding: {
        top: 8,
        bottom: 10,
        left: 15,
        right: 15,
      },
      bodySpacing: 8,
      boxWidth: 9,
      boxHeight: 9,
      boxPadding: 6,
      bodyFont: {
        size: 12,
      },
      backgroundColor: function ({tooltip}: any) {
        return '#00002D'
      },
      callbacks: {
        labelColor: (ctx: any) => ({
          borderColor: ctx.dataset?.backgroundColor,
          backgroundColor: '#00002D',
          borderWidth: 3,
          borderRadius: 4.5,
        }),
        labelTextColor: () => '#fff',
        label: (ctx: any) => `${ctx?.formattedValue}% | ${ctx.dataset?.counts[ctx?.dataIndex]}`,
        title: (ctx: any) => ctx[0]?.dataset?.label,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      barPercentage: 0.4,
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
      categoryPercentage: 0.9,
    },
    y: {
      stacked: true,
      border: {
        display: false,
      },
      grid: {
        display: false,
        drawTicks: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
  },
}

export const trendingGraphFixedYAxisYOptions = {
  maintainAspectRatio: false,
  barThickness: 20,
  layout: {
    padding: {
      bottom: 10.3,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      padding: {
        top: 8,
        bottom: 10,
        left: 15,
        right: 15,
      },
      bodySpacing: 8,
      boxWidth: 9,
      boxHeight: 9,
      boxPadding: 6,
      bodyFont: {
        size: 12,
      },
      backgroundColor: function ({tooltip}: any) {
        return '#00002D'
      },
      callbacks: {
        labelColor: (ctx: any) => ({
          borderColor: ctx.dataset?.backgroundColor,
          backgroundColor: '#00002D',
          borderWidth: 3,
          borderRadius: 4.5,
        }),
        labelTextColor: () => '#fff',
        label: (ctx: any) => `${ctx?.formattedValue}% | ${ctx.dataset?.counts[ctx?.dataIndex]}`,
        title: (ctx: any) => ctx[0]?.dataset?.label,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      barPercentage: 0.4,
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        color: 'white',
      },
    },
    y: {
      stacked: true,
      ticks: {
        padding: 20,
        callback: (value: any) => value + '%',
      },
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      afterFit: (context: any) => {
        context.width += 55
      },
    },
  },
}

export const extractData = (trendData: any[]) => {
  let results: any[] = []
  let colors: string[] = []

  const {questions} = trendData[0]
  const {answers} = questions[0]
  const {choices} = answers
  const categories = choices?.map((choice: {description: any}) => choice?.description)

  results = questions?.[0]?.answers?.choices?.map(() => [])
  colors = questions?.[0]?.answers?.choices?.map(({color}: any) => color)

  trendData?.forEach(({questions}: any, qIdx: number) => {
    questions?.[0]?.answers?.choices?.forEach(
      (choice: any, cIdx: number) => (results[cIdx][qIdx] = choice),
    )
  })

  return {results, colors, categories}
}

export function filtrarDatos(inputArray: any[]) {
  return inputArray.map((item: {label: any; questions: any[]}) => ({
    label: item.label,
    questions: item.questions.map((question: {description: any; answers: any}) => ({
      description: question.description,
      answers: {choices: question.answers.choices},
    })),
  }))
}
