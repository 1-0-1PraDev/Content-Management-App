import DOMPurify from 'dompurify';

const sanitizeHtml = (html) => {
    const clean = DOMPurify.sanitize(html);
    return {__html: clean};
}

export default sanitizeHtml;