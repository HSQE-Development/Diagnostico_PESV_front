import {
  DiagnosisDTO,
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
} from "@/interfaces/Diagnosis";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  questions: [] as DiagnosisQuestions[],
  questionsGrouped: [] as DiagnosisQuestionsGroup[],
  percentageObtained: 0 as number,
  totalVariableValue: 0 as number,
  totalValueObtained: 0 as number,
  percentageCompleted: 0 as number,
  diagnosisData: [] as DiagnosisDTO[],
};

export const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<DiagnosisQuestions[]>) => {
      state.questions = action.payload;
    },
    setQuestionsGrouped: (
      state,
      action: PayloadAction<DiagnosisQuestionsGroup[]>
    ) => {
      state.questionsGrouped = action.payload;
      state.totalVariableValue = calculateTotalVariableValue(action.payload);
      state.percentageCompleted = calculatePercentageCompleted(
        state.totalValueObtained,
        state.totalVariableValue
      );
    },
    setUpdatePercentage: (
      state,
      action: PayloadAction<{
        questionId: number;
        companyId: number;
        compliance: number;
      }>
    ) => {
      const { questionId, companyId, compliance } = action.payload;
      const question = findQuestionById(state.questionsGrouped, questionId);
      if (question) {
        const diagnosisIndex = state.diagnosisData.findIndex(
          (data) => data.question === questionId && data.company === companyId
        );
        let obtainedValue = 0;
        if (diagnosisIndex >= 0) {
          obtainedValue = calculateValueObtained(
            question.variable_value,
            compliance,
            state.diagnosisData[diagnosisIndex].is_articuled
          );
          state.diagnosisData[diagnosisIndex] = {
            ...state.diagnosisData[diagnosisIndex],
            compliance,
            obtained_value: obtainedValue,
          };
        } else {
          obtainedValue = calculateValueObtained(
            question.variable_value,
            compliance,
            true // Por defecto isArticulated es true
          );
          state.diagnosisData.push({
            question: questionId,
            company: companyId,
            compliance,
            obtained_value: obtainedValue,
            verify_document: null,
            observation: null,
            is_articuled: true,
          });
        }

        state.totalValueObtained = calculateTotalValueObtainedFromDiagnosisData(
          state.diagnosisData
        );
        // state.totalValueObtained += obtainedValue;
        state.percentageCompleted = calculatePercentageCompleted(
          state.totalValueObtained,
          state.totalVariableValue
        );
      }
    },
    setUpdateArticulated: (
      state,
      action: PayloadAction<{ questionId: number; isArticulated: boolean }>
    ) => {
      const { questionId, isArticulated } = action.payload;
      const question = findQuestionById(state.questionsGrouped, questionId);
      if (question) {
        const diagnosisIndex = state.diagnosisData.findIndex(
          (data) => data.question === questionId
        );
        if (diagnosisIndex >= 0) {
          state.diagnosisData[diagnosisIndex] = {
            ...state.diagnosisData[diagnosisIndex],
            is_articuled: isArticulated,
            obtained_value: calculateValueObtained(
              question.variable_value,
              state.diagnosisData[diagnosisIndex].compliance,
              isArticulated
            ),
          };

          state.totalValueObtained =
            calculateTotalValueObtainedFromDiagnosisData(state.diagnosisData);
          // state.totalValueObtained += obtainedValue;
          state.percentageCompleted = calculatePercentageCompleted(
            state.totalValueObtained,
            state.totalVariableValue
          );
        }
      }
    },
    resetDiagnosis: (state) => {
      state.diagnosisData.map((data) => (data.compliance = 2));
    },
  },
});
const calculateTotalVariableValue = (
  questionsGrouped: DiagnosisQuestionsGroup[]
): number => {
  return questionsGrouped.reduce((total, group) => {
    return (
      total +
      group.questions.reduce((groupTotal, question) => {
        return groupTotal + question.variable_value;
      }, 0)
    );
  }, 0);
};

const calculateTotalValueObtainedFromDiagnosisData = (
  diagnosisData: DiagnosisDTO[]
): number => {
  return diagnosisData.reduce((total, data) => {
    // console.log("data.obtained_value", data.obtained_value);
    // console.log("data.compliance", data.compliance);
    return total + data.obtained_value;
  }, 0);
};

const calculateValueObtained = (
  variableValue: number,
  compliance: number,
  isArticulated?: boolean
): number => {
  if (!isArticulated) {
    return variableValue;
  }
  switch (compliance) {
    case 1:
    case 4:
      return variableValue;
    case 2:
      return 0;
    case 3:
      return variableValue / 2;
    default:
      return 0;
  }
};

const calculatePercentageCompleted = (
  totalValueObtained: number,
  totalVariableValue: number
): number => {
  if (totalVariableValue === 0) {
    return 0;
  }

  const percentage = (totalValueObtained / totalVariableValue) * 100;
  return parseFloat(percentage.toFixed(2));
};

const findQuestionById = (
  questionsGrouped: DiagnosisQuestionsGroup[],
  id: number
): DiagnosisQuestions | undefined => {
  for (let group of questionsGrouped) {
    const question = group.questions.find((q) => q.id === id);
    if (question) {
      return question;
    }
  }
  return undefined;
};

export const {
  setQuestions,
  setQuestionsGrouped,
  setUpdatePercentage,
  setUpdateArticulated,
  resetDiagnosis,
} = diagnosisSlice.actions;

export default diagnosisSlice.reducer;
