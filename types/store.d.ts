interface ICode {
  id: string
  name: string
  definition: string
}

interface ICodeBook {
  id: string
  name: string
  codes: ICode[]
}
