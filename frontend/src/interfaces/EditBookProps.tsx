export default interface EditBookProps {
    title: string;
    authorFirst: string;
    authorLast: string;
    publisher: string;
    publicationDate: string;
    pageCount: string;
    isbn: string;
    genre: string;
    synopsis: string;
    coverImg: File | null;
}