import { ref, reactive } from 'vue'

export const useFormModal = (object) => {
  const myForm = reactive(object)

  const resetForm = () => {
    Object.assign(myForm, object)
  }

  const myFormModalRef = ref(null)

  return { myForm, resetForm, myFormModalRef }
}
