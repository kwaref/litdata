/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
"use client";
import { useSupabase } from "@/app/supabase-provider";
import { useFetchWidgets } from "@/components/utils/use-fetch-widgets";
import { surveyStore } from "@/components/utils/use-survey";
import { useUser } from "@/components/utils/use-user";
import {
  createBaseCrossTab,
  fillCrossTabCounts,
  filterSurveyAnswers,
  filtrarPorFecha,
  updateFilteredData,
} from "@/utils/filterSurveyAnswers";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the SurveyDataContextProps interface
interface SurveyDataContextProps {
  surveyData: any;
  setSurveyData: (surveyData: any) => void;
  resetSurveyData: () => void;
  handleFilters: (filter: any) => void;
  filterOptions: any[];
  filters: any[];
  resetFilters: () => void;
  crosses: Cross[];
  setCrosses: (crosses: Cross[]) => void;
  setFilters: (crosses: any[]) => void;
  crossesData: any;
  handleDate: any;
  dateFilter: {
    startDate: string;
    endDate: string;
  };
  setDateFilter: (dateFilter: { startDate: string; endDate: string }) => void;
  handleDeleteCrosses: () => void;
  handleDeleteSingleFilter: (questionId: string) => void;
  editMode: any;
  setEditMode: (editMode: any) => void;
  trend: number;
  setTrend: (trend: number) => void;
  relevantAnswers: any[];
  originalSurveyData: any;
  widgets: any[];
  widgetsCount: number;
  setWidgetsCount: (wc: number) => void
  loadingCrosses: boolean
}
interface Cross {
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
  questionX: string[];
  questionY: string[];
}

const SurveyDataContext = createContext<SurveyDataContextProps | undefined>(
  undefined,
);

export const SurveyDataProvider = ({
  children,
  initialState = null,
}: {
  children: React.ReactNode;
  initialState?: any;
}) => {
  const [originalSurveyData, setOriginalSurveyData] =
    useState<any>(initialState);
  const [surveyData, setSurveyData] = useState<any>(initialState);
  const [filters, setFilters] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [crosses, setCrosses] = useState<Cross[]>([]);
  const [crossesData, setCrossesData] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [editMode, setEditMode] = useState({
    isEdit: false,
    mode: "",
  });
  const [trend, setTrend] = useState(1);
  const [relevantAnswers, setRelevantAnswers] = useState(initialState?.answers);
  const { userDetails } = useUser();
  const {data: widgets} = useFetchWidgets();
  const [widgetsCount, setWidgetsCount] = useState(0);
  const {surveyData: storedSurveyData} = surveyStore()

  const [loadingCrosses, setLoadingCrosses] = useState<boolean>(false)

  useEffect(() => {
    if (crosses?.length > 0 && originalSurveyData?.answers?.length > 0) {
      setLoadingCrosses(true)
      // filtrar por fecha
      const filteredDataByDateRange = filtrarPorFecha(
        // @ts-ignore
        [...originalSurveyData?.answers],
        crosses[0].startDate,
        crosses[0].endDate,
      );

      // construir la data con todas las stats a 0 (coge las pregs y resps de los filtros segun los id que trae el cruce)
      let questionsY: any[] = [];
      let questionsX: any[] = [];

      crosses[0]?.questionY.forEach((question) => {
        questionsY = [...questionsY, ...filterOptions.filter((opt) => question.includes(opt.value))];
      });

      crosses[0]?.questionX.forEach((question) => {
        questionsX = [...questionsX, ...filterOptions.filter((opt) => question.includes(opt.value))];
      });

      const baseCrossTab = createBaseCrossTab(questionsY, questionsX);

      // recorrer las answers y llenar la prop count y las stats
      if (
        (filteredDataByDateRange?.length > 0,
        baseCrossTab?.length > 0 &&
          crosses[0]?.questionY?.length > 0 &&
          crosses[0]?.questionX?.length > 0)
      ) {
        const filledCrossTab = fillCrossTabCounts(
          // @ts-ignore
          filteredDataByDateRange,
          baseCrossTab,
          crosses[0].questionY,
          crosses[0].questionX,
        );
        // add data to crosses property
        setCrossesData([{ ...crosses[0], data: filledCrossTab }]);
      }

      setLoadingCrosses(false)
    }
  }, [crosses, originalSurveyData]);
  

  useEffect(() => {
    if(storedSurveyData){
      const newActiveSurvey = {
        ...storedSurveyData,
        questions:
          userDetails?.role === "admin"
            ? storedSurveyData?.questions
            // @ts-ignore
            : storedSurveyData?.questions.filter(
                (el: any) => userDetails?.permissions?.includes(el.id),
                // true
              ),
      };
      setOriginalSurveyData(newActiveSurvey ?? null);
      setSurveyData(newActiveSurvey ?? null);
    }
  }, [storedSurveyData, userDetails]);

  useEffect(() => {
    // Move the filterSurveyData function to a separate effect to reduce complexity
    if (originalSurveyData?.answers) {
      filterSurveyData();
    } else {
      resetSurveyData();
    }
  }, [
    filters,
    originalSurveyData,
    dateFilter?.startDate,
    dateFilter?.endDate,
    userDetails,
  ]);

  useEffect(() => {
    // Extract the creation of filter options to a separate function
    if (originalSurveyData?.questions?.length > 0) {
      createFilterOptions(originalSurveyData.questions);
    }
  }, [originalSurveyData]);

  useEffect(() => {
    widgets && setWidgetsCount(widgets?.length)
  }, [widgets])
  

  const createFilterOptions = async (questions: any[]) => {
    // const userPermissions = await getUserPermissions();

    // const actualQuestions = userDetails.role === 'admin' ? questions : questions.filter(q => userPermissions.includes(q.id))

    const newFilterOptions = questions.map((question: any) => ({
      value: question.id,
      label: question.description,
      type: question.type,
      subtype: question.subtype,
      choices: question.answers?.choices?.map((answer: any) => ({
        value: answer.id,
        label: answer.description,
      })),
      rows: question.answers?.rows?.map((row: any) => ({
        value: row.id,
        label: row.description,
      })),
    }));

    setFilterOptions(
      newFilterOptions.map((el) => {
        let newLabel = el.label;
        if (el.label.includes("<strong>")) {
          newLabel = el.label.split("<strong>")[0].trim();
        }
        return { ...el, label: newLabel };
      }),
    );
  };

  const filterSurveyData = (resetFilters = false) => {
    // Apply filters and update surveyData
    const filteredAnswers = filterSurveyAnswers(
      originalSurveyData.answers,
      resetFilters ? [] : [...filters],
      dateFilter?.startDate,
      // @ts-ignore
      dateFilter?.endDate || new Date(),
    );
    setRelevantAnswers(filteredAnswers);

    const filteredData = updateFilteredData(
      originalSurveyData,
      filteredAnswers,
    );

    setSurveyData(filteredData);
  };

  const resetSurveyData = () => {
    // Restore the original data
    setSurveyData(originalSurveyData);
  };

  const resetFilters = () => {
    handleFilters([]);
  };

  const handleFilters = (filter: any) => {
    if (filter?.length === 0) {
      setFilters([]);
      filterSurveyData(true);
      return;
    }

    const newFilters = [...filters];
    const existingFilterIndex = newFilters.findIndex(
      (el) => el.question_id === filter.question_id,
    );

    if (existingFilterIndex > -1) {
      newFilters[existingFilterIndex] = { ...filter };
    } else {
      newFilters.push({ ...filter });
    }

    setFilters(newFilters);
  };

  // @ts-ignore
  const handleDate = (start, end) => {
    setDateFilter({ startDate: start, endDate: end });
  };

  const handleDeleteCrosses = () => {
    setCrosses([]);
    setCrossesData([]);
  };

  const handleDeleteSingleFilter = (questionId: string) => {
    const newFilters = [...filters].filter(
      (el) => el.question_id !== questionId,
    );
    setFilters([...newFilters]);
  };

  return (
    <SurveyDataContext.Provider
      value={{
        surveyData,
        setSurveyData,
        resetSurveyData,
        filterOptions,
        handleFilters,
        filters,
        resetFilters,
        crosses,
        setCrosses,
        setFilters,
        crossesData,
        handleDate,
        dateFilter,
        handleDeleteCrosses,
        handleDeleteSingleFilter,
        editMode,
        setEditMode,
        setDateFilter,
        trend,
        setTrend,
        relevantAnswers,
        originalSurveyData,
        widgets,
        widgetsCount,
        setWidgetsCount,
        loadingCrosses
      }}
    >
      {children}
    </SurveyDataContext.Provider>
  );
};

export const useSurveyDataContext = () => {
  const context = useContext(SurveyDataContext);
  if (!context) {
    throw new Error(
      "useSurveyDataContext must be used within a SurveyDataProvider",
    );
  }
  return context;
};
