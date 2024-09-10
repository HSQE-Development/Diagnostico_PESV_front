import { Diagnosis } from "@/interfaces/Company";
import {
  DiagnosisDTO,
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
  DiagnosisRequirementDTO,
} from "@/interfaces/Diagnosis";
import { Notification } from "@/interfaces/Notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  questions: [] as DiagnosisQuestions[],
  questionsGrouped: [] as DiagnosisQuestionsGroup[],
  percentageObtained: 0 as number,
  totalVariableValue: 0 as number,
  totalValueObtained: 0 as number,
  percentageCompleted: 0 as number,
  diagnosisData: [] as DiagnosisDTO[],
  diagnosisRequirementData: [] as DiagnosisRequirementDTO[],
  observation: {} as {
    [req_id: number]: string | null;
  },
  diagnosis: null as Diagnosis | null,
  diagnosis_notifications: [] as Notification[],
};

export const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    setDiagnosis: (state, action: PayloadAction<Diagnosis>) => {
      state.diagnosis = action.payload;
    },
    removeDiagnosis: (state) => {
      state.diagnosis = null;
    },
    setDiagnosisNotifications: (
      state,
      action: PayloadAction<Notification[]>
    ) => {
      state.diagnosis_notifications = action.payload;
    },
    setDiagnosisNotification: (state, action: PayloadAction<Notification>) => {
      const notificationExists = state.diagnosis_notifications.find(
        (notification) => notification.id === action.payload.id
      );

      if (!notificationExists) {
        state.diagnosis_notifications.push(action.payload);
      }
    },
    setQuestions: (state, action: PayloadAction<DiagnosisQuestions[]>) => {
      state.questions = action.payload;
    },
    setQuestionsGrouped: (
      state,
      action: PayloadAction<DiagnosisQuestionsGroup[]>
    ) => {
      state.questionsGrouped = action.payload;

      // state.totalVariableValue = calculateTotalVariableValue(action.payload);
      // state.percentageCompleted = calculatePercentageCompleted(
      //   state.totalValueObtained,
      //   state.totalVariableValue
      // );
    },
    setUpdateObservation: (
      state,
      action: PayloadAction<{ reqId: number; observation: string | null }>
    ) => {
      const { reqId, observation } = action.payload;
      const requirement = findRequirementById(state.questionsGrouped, reqId);
      if (requirement) {
        const requirementIndex = state.diagnosisRequirementData.findIndex(
          (data) => data.requirement == reqId
        );

        if (requirementIndex >= 0) {
          state.diagnosisRequirementData[requirementIndex] = {
            ...state.diagnosisRequirementData[requirementIndex],
            observation,
          };
        }
      }
    },
    setUpdateRequirement: (
      state,
      action: PayloadAction<{
        requirementId: number;
        compliance: number;
        observation: string | null;
      }>
    ) => {
      const { requirementId, compliance, observation } = action.payload;
      const requirement = findRequirementById(
        state.questionsGrouped,
        requirementId
      );

      if (requirement) {
        const requirementIndex = state.diagnosisRequirementData.findIndex(
          (data) => data.requirement == requirementId
        );
        if (requirementIndex >= 0) {
          state.diagnosisRequirementData[requirementIndex] = {
            ...state.diagnosisRequirementData[requirementIndex],
            compliance,
            observation,
          };
        } else {
          state.diagnosisRequirementData.push({
            compliance,
            observation,
            requirement: requirement.id,
          });
        }
      }
    },
    setCheckDiagnosisDataForChanges: (state) => {
      state.diagnosisData = state.diagnosisData.filter((data) =>
        state.questionsGrouped.some((grouped) =>
          grouped.questions.some((question) => question.id === data.question)
        )
      );
    },
    setUpdatePercentage: (
      state,
      action: PayloadAction<{
        questionId: number;
        compliance: number;
      }>
    ) => {
      state.totalVariableValue = calculateTotalVariableValue(
        state.questionsGrouped
      );
      const { questionId, compliance } = action.payload;
      // Filtrar diagnosisData para eliminar preguntas que ya no están en questionsGrouped

      const question = findQuestionById(state.questionsGrouped, questionId);
      if (question) {
        const diagnosisIndex = state.diagnosisData.findIndex(
          (data) => data.question === questionId
          //  && data.company === companyId
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

const findRequirementById = (
  questionsGrouped: DiagnosisQuestionsGroup[],
  id: number
): DiagnosisQuestionsGroup | undefined => {
  const requirement = questionsGrouped.find((qG) => qG.id === id);
  if (requirement) {
    return requirement;
  }
  return undefined;
};

export const {
  setQuestions,
  setQuestionsGrouped,
  setUpdatePercentage,
  setUpdateArticulated,
  resetDiagnosis,
  setUpdateRequirement,
  setUpdateObservation,
  setDiagnosis,
  removeDiagnosis,
  setCheckDiagnosisDataForChanges,
  setDiagnosisNotifications,
  setDiagnosisNotification,
} = diagnosisSlice.actions;

export default diagnosisSlice.reducer;
