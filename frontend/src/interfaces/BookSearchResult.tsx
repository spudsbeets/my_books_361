export default interface BookSearchResult {
    bookID: number,
    title: string,
    authorFirst: string,
    authorLast: string,
    coverSrc: string,
    rating?: string
}