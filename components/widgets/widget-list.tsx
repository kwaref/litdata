import WidgetQuestion from './widget-question'

interface IWidgetQuestion {
  id: string
  description: string
  answers: any
  type: string
  matrixMap?: any
  filters: string[]
  remove: () => void
}

interface IWidgetListProps {
  questions: IWidgetQuestion[]
  header: string
  remove: (id: string | number) => void
}

const WidgetList: React.FC<IWidgetListProps> = ({questions, header, remove}) => {
  return (
    <>
      <h2 className="w-full py-5 font-degular text-2xl font-semibold">{header}</h2>
      <div className="grid items-start justify-between gap-4  grid-cols-1 md:grid-cols-2">
        <div className={`flex flex-col gap-y-6 md:hidden`}>
          {questions?.map(question => (
            <WidgetQuestion key={question.id} data={question} remove={remove} />
          ))}
        </div>
        <div className="flex-col items-center gap-y-6 hidden md:flex">
          {questions?.map(
            (question, index) =>
              index % 2 === 0 && (
                <WidgetQuestion key={question.id} data={question} remove={remove} />
              ),
          )}
        </div>
        <div className="flex-col items-center gap-y-6 hidden md:flex">
          {questions?.map(
            (question, index) =>
              index % 2 !== 0 && (
                <WidgetQuestion key={question.id} data={question} remove={remove} />
              ),
          )}
        </div>
      </div>
    </>
  )
}

export default WidgetList
