import { CompanyDTO } from "@/interfaces/Company";
import { setCompany, setUpdateCompany } from "@/stores/features/companySlice";
import { useAppDispatch } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { removeHyphen } from "@/utils/utilsMethods";

/**
 * Custom hook to handle company-related operations such as creating and updating a company.
 *
 * @returns {Object} - Functions for changing and creating a company.
 */
const useCompany = () => {
  const dispatch = useAppDispatch();
  const [updateCompany, { isLoading: isUpdating }] =
    companyService.useUpdateCompanyMutation();
  const [save, { isLoading: isSaving }] = companyService.useSaveMutation();

  /**
   * Function to update an existing company.
   *
   * @param {number} id - The ID of the company to be updated.
   * @param {CompanyDTO} values - The updated company data.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   */
  const changeCompany = async (id: number, values: CompanyDTO) => {
    try {
      const updatedCompany = await updateCompany({
        id, //Id de la maquina que se quiere editar
        name: values.name,
        email: values.email,
        acquired_certification: values.acquired_certification,
        nit: removeHyphen(values.nit, "-"),
        dependant: values.dependant,
        dependant_phone: values.dependant_phone,
        dependant_position: values.dependant_position,
        segment: values.segment,
        mission: values.mission ?? undefined,
        size: values.size ?? undefined,
        ciius: values.ciius ?? null,
        arl: values.arl ?? undefined,
        
      }).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
      dispatch(setUpdateCompany(updatedCompany));
      return updatedCompany;
    } catch (error) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al actualizar");
      console.error("Error updating company:", error);
      return null;
    }
  };

  /**
   * Function to create a new company.
   *
   * @param {CompanyDTO} values - The data for the new company.
   * @returns {Promise<void>} - A promise that resolves when the creation is complete.
   */
  const createCompany = async (values: CompanyDTO) => {
    try {
      values.nit = removeHyphen(values.nit, "-");
      values.acquired_certification =
        values.acquired_certification == ""
          ? null
          : values.acquired_certification;
      const savedCompany = await save(values).unwrap(); //Metodo que guarda
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Registrado Correctamente");
      dispatch(setCompany(savedCompany));
      return savedCompany;
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
      console.error("Error creating company:", error);
      return null;
    }
  };

  return {
    changeCompany,
    createCompany,
    isUpdating,
    isSaving,
  };
};

export default useCompany;
