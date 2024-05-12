export type DisciplineDataType = {
  name: string
  subjectId: string
  adminId?: string;
  chapters: {name: string}[]
}
