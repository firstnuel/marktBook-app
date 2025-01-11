
export const validationErrorFn = (msg: string , fn: (value: React.SetStateAction<string | null>) => void): void => {
  fn(msg)
  setTimeout(() => {
    fn(null)
  }, 3000)
}
