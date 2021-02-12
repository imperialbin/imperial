import { CodeJar } from './codeJar.js';

const highlight = editor => {
    editor.textContent = editor.textContent;
    hljs.highlightBlock(editor)
}
const editor = document.querySelector('#codeThing');
const codeBox = CodeJar(editor, highlight);

window.addEventListener('popstate', () => {
    if (location.pathname == '/' || location.pathname == '/p/') {
        $('#submitCode').text('')
        $('#lines').text('>')
        $('#codeThing').focus();
    } else {
        location.reload();
    }
});

$(document).ready(() => {
    $('#codeThing').focus();
    if (localStorage.hasOwnProperty('duplicatePaste')) {
        codeBox.updateCode(localStorage.getItem('duplicatePaste'))
        localStorage.removeItem('duplicatePaste');
    } else {
        navigator.clipboard.readText()
            .then(copiedText => {
                if (localStorage.getItem('clipboard') == 'true') {
                    codeBox.updateCode(copiedText);
                }
            })
            .catch(err => {
                console.log(err);
                console.log('denied paste capabilities')
            })
    }
});
$(window).on("keydown", e => {
    switch (true) {
        case e.key === 's' && e.ctrlKey:
            e.preventDefault();
            uploadCode();
            break;
        case e.key === 'o' && e.ctrlKey:
            e.preventDefault();
            newDocument();
            break;
        case e.key === 't' && e.altKey:
            if (location.pathname === '/') {
                window.open(`https://twitter.com/intent/tweet?text=I%20use%20Imperialbin!%20An%20advanced%20and%20feature%20rich%20pastebin,%20start%20using%20it%20today%20at%20https://www.imperialb.in/!`, '_blank');
            } else {
                window.open(`https://twitter.com/intent/tweet?text=Here%20is%20a%20document%20I%20made%20on%20Imperialbin%20https://www.imperialb.in${location.pathname}`, '_blank');
            }
            break;
    }
});