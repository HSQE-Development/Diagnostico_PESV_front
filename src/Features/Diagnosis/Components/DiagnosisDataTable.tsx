import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  setQuestionsGrouped,
  setUpdatePercentage,
} from "@/stores/features/diagnosisSlice";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import {
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
} from "@/interfaces/Diagnosis";
import { ConfigProvider, Segmented, Table, TableColumnsType } from "antd";

interface Props {
  companyId: number;
}
interface DataType extends DiagnosisQuestionsGroup {
  key: React.Key;
  selectedSegment: number;
}
interface ExpandedDataType extends DiagnosisQuestions {
  key: React.Key;
  selectedSegment: number;
}

export default function DiagnosisDataTable({ companyId }: Props) {
  const dispatch = useAppDispatch();
  const { data: diagnosisQuestionsByCompany, refetch } =
    diagnosisService.useFindQuestionsByCompanysizeGroupedQuery({ companyId });

  useEffect(() => {
    refetch();
  }, [companyId]);

  useEffect(() => {
    if (diagnosisQuestionsByCompany) {
      // Agrupar preguntas por step
      dispatch(setQuestionsGrouped(diagnosisQuestionsByCompany));
    }
  }, [diagnosisQuestionsByCompany]);

  const questionsGrouped = useAppSelector(
    (state) => state.diagnosis.questionsGrouped
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<{
    [key: string]: number;
  }>({});
  const [selectedSegmentsExpanded, setSelectedSegmentsExpanded] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (questionsGrouped.length > 0) {
      const initialExpandedKeys: { [key: string]: number } = {};
      const initialSelectedSegments: { [key: string]: number } = {};

      questionsGrouped.forEach((group) => {
        initialExpandedKeys[group.step.toString()] = 2;

        group.questions.forEach((question) => {
          initialSelectedSegments[question.id.toString()] = 2;

          dispatch(
            setUpdatePercentage({
              questionId: question.id,
              companyId,
              compliance: 2,
            })
          );
        });
      });

      setExpandedRowKeys(initialExpandedKeys);
      setSelectedSegmentsExpanded(initialSelectedSegments);
    }
  }, [questionsGrouped]);

  const handleSegmentChange = (record: DataType, value: number) => {
    // Actualizar el segmento seleccionado en la tabla principal
    setExpandedRowKeys({
      ...expandedRowKeys,
      [record.step.toString()]: value,
    });
    const updatedSegments = { ...selectedSegmentsExpanded };
    // Actualizar compliance y obtained_value en el estado local y en el store de Redux
    record.questions.forEach((question) => {
      updatedSegments[question.id.toString()] = value;
      // Calcular obtained_value basado en el compliance seleccionado
      // También actualiza el porcentaje aquí
      dispatch(
        setUpdatePercentage({
          questionId: question.id,
          companyId,
          compliance: value,
        })
      );
    });
    setSelectedSegmentsExpanded(updatedSegments);
    // Actualizar el estado en el store de Redux si es necesario
  };

  const handleSegmentQuestion = (record: ExpandedDataType, value: number) => {
    dispatch(
      setUpdatePercentage({
        questionId: record.id,
        companyId,
        compliance: value,
      })
    );
    setSelectedSegmentsExpanded({
      ...selectedSegmentsExpanded,
      [record.id.toString()]: value,
    });

    // Actualizar el estado en el store de Redux si es necesario
  };
  const defaultColors = {
    itemActiveBg: "#007bff",
    itemColor: "#000",
    itemHoverBg: "#f0f0f0",
    itemHoverColor: "#333333",
    itemSelectedBg: "#ffffff",
    itemSelectedColor: "#fff",
    trackBg: "#f5f5f5",
  };
  const conditionalColors: any = {
    1: {
      itemActiveBg: "#28a745",
      itemColor: "#BABABA",
      itemSelectedBg: "#28a745",
      itemSelectedColor: "#fff",
    },
    2: {
      itemActiveBg: "#dc3545",
      itemColor: "#BABABA",
      itemSelectedBg: "#dc3545",
      itemSelectedColor: "#fff",
    },
    3: {
      itemActiveBg: "#ffc107",
      itemColor: "#BABABA",
      itemSelectedBg: "#ffc107",
      itemSelectedColor: "#fff",
    },
    4: {
      itemActiveBg: "#17a2b8",
      itemColor: "#BABABA",
      itemSelectedBg: "#17a2b8",
      itemSelectedColor: "#fff",
    },
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "PASO PESV",
      dataIndex: "step",
      key: "step",
      render: (text: number) => `Paso ${text}`,
    },
    {
      title: "FASE",
      dataIndex: "cycle",
      key: "cycle",
    },
    {
      title: "Requerimiento",
      dataIndex: "requirement_name",
      key: "requirement_name",
    },
    {
      title: "Nivel de Cumplimiento",
      render: (_, record) => {
        const colors =
          conditionalColors[record.selectedSegment] || defaultColors;
        // console.log(expandedRowKeys);
        return (
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  ...colors,
                },
              },
            }}
          >
            <Segmented
              key={record.step}
              size="middle"
              options={[
                {
                  label: "C",
                  value: 1,
                },
                {
                  label: "NC",
                  value: 2,
                },
                {
                  label: "NA",
                  value: 4,
                },
              ]}
              defaultValue={2}
              value={expandedRowKeys[record.key as string] || 2} // Valor seleccionado por defecto o el valor guardado
              onChange={(value) => handleSegmentChange(record, value)}
            />
          </ConfigProvider>
        );
      },
    },
  ];
  const dataSource: DataType[] = questionsGrouped.map((question) => ({
    ...question,
    key: question.step,
    selectedSegment: expandedRowKeys[question.step.toString()] || 2,
  }));

  const expandedRowRender = (record: DiagnosisQuestionsGroup) => {
    const data = record.questions
      .filter((question) => question.requirement_detail.step === record.step)
      .map((question) => ({
        ...question,
        key: question.id.toString(), //
        selectedSegment:
          selectedSegmentsExpanded[record.step.toString()] ||
          expandedRowKeys[record.step.toString()],
      }));

    const columns: TableColumnsType<ExpandedDataType> = [
      {
        title: "Criterio de Verificación",
        dataIndex: "name",
        key: "cycle",
      },

      {
        title: "Valor de la variable",
        dataIndex: "variable_value",
        key: "variable_value",
        render: (text: number) => `${text}%`,
      },
      {
        title: "Nivel de Cumplimiento",
        render: (_, record) => (
          <Segmented
            key={record.requirement_detail.step}
            size="small"
            options={[
              {
                label: "C",
                value: 1,
              },
              {
                label: "NC",
                value: 2,
              },
              {
                label: "CP",
                value: 3,
              },
              {
                label: "NA",
                value: 4,
              },
            ]}
            defaultValue={2}
            value={
              selectedSegmentsExpanded[record.id.toString()] ||
              expandedRowKeys[record.requirement_detail.step.toString()] ||
              2
            }
            onChange={(value) => handleSegmentQuestion(record, value)}
          />
        ),
      },
      {
        title: "Esta Articulado?",
        render: (_, record) => {
          const colors =
            conditionalColors[record.requirement_detail.step] || defaultColors;
          return (
            <ConfigProvider
              theme={{
                components: {
                  Segmented: {
                    ...colors,
                  },
                },
              }}
            >
              <Segmented
                key={record.id}
                size="small"
                options={[
                  {
                    label: "SI",
                    value: 1,
                  },
                  {
                    label: "NO",
                    value: 2,
                  },
                ]}
              />
            </ConfigProvider>
          );
        },
      },
      // Añade más columnas según sea necesario
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false} // Desactiva la paginación si no la necesitas
      expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
    />
  );
}
