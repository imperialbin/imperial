window.addEventListener('popstate', () => {
    if (location.pathname == '/' || location.pathname == '/p/') {
        location.reload();
    }
});
$(window).on("keydown", e => {
    switch (true) {
        case e.key === 's' && e.ctrlKey:
            e.preventDefault();
            if (document.querySelector('.editButtonActive') !== null) {
                postEditPaste();
                emitEditPost();
            }
            break;
        case e.key === 'o' && e.ctrlKey:
            e.preventDefault();
            newDocument();
            break;
    }
});

function newDocument() {
    location.href = '/'
}

function copyLink() {
    const linkBox = document.createElement('textarea');
    linkBox.value = location.href;
    document.body.appendChild(linkBox);
    linkBox.select();
    document.execCommand('copy');
    document.body.removeChild(linkBox);
}