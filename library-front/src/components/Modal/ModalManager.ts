interface ModalInfo {
  onCloseModal: () => void
}

const modals = new Map<string, ModalInfo>()

export const addModal = (id: string, onCloseModal: () => void) => {
  modals.set(id, { onCloseModal })
}

export const removeModal = (id: string) => {
  const modal = modals.get(id)

  if (modal) {
    modal.onCloseModal()
  }
  modals.delete(id)
}
