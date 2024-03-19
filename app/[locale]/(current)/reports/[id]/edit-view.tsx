/* eslint-disable prettier/prettier */
import { useSupabase } from "@/app/supabase-provider";
import { useUser } from "@/components/utils/use-user";
import { fixedFilters } from "@/utils/fixed-filters";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSurveyDataContext } from "./survey-data-context";
import Filters from "./filters";
import Corsstabs from "./crosstabs";

interface EditViewProps {
  reportId: string;
  reportData: any;
}

const EditView = ({ reportId, reportData }: EditViewProps) => {
  const { filterOptions } = useSurveyDataContext();
  const [filters, setFilters] = useState<any[]>([]);
  const [crosses, setCrosses] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const { userDetails } = useUser();

  useEffect(() => {
      setOwnerId(reportData?.user_id || "");
      if (reportData?.isFilter) {
        if (reportData?.data?.filters?.length > 0) {
          setFilters([...reportData?.data?.filters]);
        }
      } else if (reportData?.data?.crosses?.length > 0) {
        setCrosses([...reportData?.data?.crosses]);
      }
  }, [reportData]);

  if (!reportData) return <></>

  if (ownerId !== userDetails?.id)
    return (
      <ul className="px-8 py-6">
        <li className="mb-6 text-primary-200 text-xs font-medium">
          <span>{reportData?.isFilter ? "MY FILTERS" : "MY CROSSTABS"}</span>
        </li>

        {reportData?.isFilter
          ? filters?.map((filter) => {
              const fixedData = fixedFilters.find(
                (el: any) => el.questionId === filter.question_id,
              );
              const questionData = filterOptions.find(
                (el: any) =>
                // @ts-ignore
                  (fixedData?.questionId || filter.question_id) === el.value,
              );
              return (
                <li
                  key={filter.question_id}
                  className="w-full border-b border-border py-2.5"
                >
                  <span className="text-primary-500 line-clamp-2 text-sm">
                    {fixedData
                      ? questionData?.choices
                          ?.map((c: any) => c.label)
                          ?.join(", ")
                      : questionData?.label}
                  </span>
                </li>
              );
            })
          : crosses?.length > 0 && (
            <li className="w-full justify-between flex items-center gap-4 border-b border-border py-2.5">
            <span className="truncate">
              {`${
                crosses[0]?.startDate ? format(new Date(crosses[0]?.startDate), 'P') : 'Today'
              } - ${
                crosses[0]?.endDate &&
                format(new Date(crosses[0]?.endDate), 'P') !== format(new Date(), 'P')
                  ? format(new Date(crosses[0]?.endDate), 'P')
                  : 'Today'
              }`}
            </span>
          </li>
            )}
      </ul>
    );

  if (reportData?.isFilter) return <Filters canEdit={reportData?.user_id === userDetails?.id} />;
  else return <Corsstabs canEdit={reportData?.user_id === userDetails?.id} editMode />;
};

export default EditView;
