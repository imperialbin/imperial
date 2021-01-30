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
        $('#codeThing').val(localStorage.getItem('duplicatePaste'));
        localStorage.removeItem('duplicatePaste');
    } else {
        navigator.clipboard.readText()
            .then(copiedText => {
                if (localStorage.getItem('clipboard') == 'true') {
                    $('#codeThing').val(copiedText);
                }
            })
            .catch(err => {
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
                window.open(`https://twitter.com/intent/tweet?text=I%20use%20Imperialbin!%20An%20advanced%20and%20feature%20rich%20pastebin,%20start%20using%20it%20today%20at%20https://www.imperialbin.com/!`, '_blank');
            } else {
                window.open(`https://twitter.com/intent/tweet?text=Here%20is%20a%20paste%20I%20made%20on%20ImperialBin%20https://www.imperialbin.com${location.pathname}`, '_blank');
            }
            break;
    }
});
function setPaste() {
    const clipboardCheck = $('#clipCheck2').is(':checked');
    localStorage.setItem('securedUrls', false);
    localStorage.setItem('clipboard', clipboardCheck);
    localStorage.setItem('deleteTime', '7');
    localStorage.setItem('instantDelete', 'false');
    localStorage.setItem('imageEmbeds', 'true');
    localStorage.setItem('customURL', 'p');
    $('.pasteSettings').removeClass('active');
}
function toggleMenu() {
    $('.pasteSettings').addClass('active');
    if (localStorage.getItem('clipboard') == 'true') {
        $('#clipCheck').prop('checked', 'true')
    }
    if (localStorage.getItem('securedUrls') == 'true') {
        $('#linkCheck').prop('checked', 'true');
    }
    if (localStorage.getItem('instantDelete') == 'true') {
        $('#deleteCheck').prop('checked', 'true');
    }
    if (localStorage.getItem('imageEmbeds') == 'true') {
        $('#embedCheck').prop('checked', 'true');
    }
    if (localStorage.getItem('customURL')) {
        $('#customURL').val(localStorage.getItem('customURL'));
        $('#previewURL').text(`(https://www.imperialb.in/${document.getElementById('customURL').value}/documentID)`);
    } else {
        $('#customURL').val('p');
    }
    $('#day').val(localStorage.getItem('deleteTime'));
}
function saveSettings() {
    const clipboardCheck = $('#clipCheck').is(':checked');
    const deleteCheck = $('#deleteCheck').is(':checked');
    const deleteTime = $('#day').val()
    const urlcheck = $('#linkCheck').is(':checked');
    const embedCheck = $('#embedCheck').is(':checked');
    const customURL = document.getElementById('customURL').value;
    localStorage.setItem('securedUrls', urlcheck);
    localStorage.setItem('clipboard', clipboardCheck);
    localStorage.setItem('deleteTime', deleteTime);
    localStorage.setItem('instantDelete', deleteCheck);
    localStorage.setItem('imageEmbeds', embedCheck);
    if ($.trim(customURL) == '') {
        localStorage.setItem('customURL', 'p');
    } else {
        localStorage.setItem('customURL', customURL);
    }
    if (deleteCheck && $('.error').length == 0) {
        $('#messages').append('<li class="message error"><i class="fas fa-info-circle" style="padding-right: 4px;"></i> Instant delete is on!</li>');
    } else if (!deleteCheck) {
        $('.error').remove();
    }
    $('.pasteSettings').removeClass('active');
}
function cancelSettings(clearThingy) {
    $('.pasteSettings').removeClass('active');
    if (clearThingy) {
        $('.user').remove();
        const getUsers = localStorage.getItem('addUser')
        if (getUsers !== null && !getUsers == '') {
            if (getUsers[0] == ',') {
                const regex = /^[,]+|[,]+$/g;
                localStorage.setItem('addUser', getUsers.replace(regex, ''))
            }
        }
    }
}

function newDocument() {
    window.history.pushState({}, null, '/')
    document.title = `Paste your document!`
    $('#submitCode').text('')
    $('#lines').text('>')
    $('#codeThing').attr('readonly', false).val('').focus();
    $('#success').remove();
}

const getUsers = localStorage.getItem('addUser')
if (getUsers !== null && !getUsers == '') {
    if (getUsers[0] == ',') {
        const regex = /^[,]+|[,]+$/g;
        localStorage.setItem('addUser', getUsers.replace(regex, ''))
    }
}

function toggleAddUser() {
    $('#addUser').addClass('active');
    const getUsers = localStorage.getItem('addUser')
    if (getUsers === 'undefined') {
        localStorage.removeItem('addUser');
    }
    if (getUsers !== null && getUsers !== '') {
        for (var users = 0; users < getUsers.split(',').length; users++) {
            const user = getUsers.split(',')[users]
            $('.users').append(`<div class="user" id="${user}"> <input id="token" type="text" value="${user}" readonly> <button class="deleteUser" onclick="removeUser('${user}')"><i class="fas fa-trash"></i></button> </div>`)
        }
    }
    document.getElementById('user').focus()
}

function removeUser(user) {
    const getUsers = localStorage.getItem('addUser')
    $(`#${user}`).remove()
    localStorage.setItem('addUser', getUsers.replace(user, ''))
    if (getUsers == '' || getUsers === undefined) {
        localStorage.removeItem('addUsers');
    }
}

function addUser(user) {
    const users = localStorage.getItem('addUser');
    if (!$.trim(user) == '') { // checks if input has an actual user or just spaces, those sneaky bastards.
        const regex = /^[,"]+|[,"]+$/g;
        const formattedUser = user.replace(regex, '');
        if (users !== null && !users == '') {
            const newUsers = `${users},${formattedUser}`
            $('.users').append(`<div class="user" id="${formattedUser}"> <input id="token" type="text" value="${formattedUser}" readonly> <button class="deleteUser" onclick="removeUser('${formattedUser}')"><i class="fas fa-trash"></i></button> </div>`)
            localStorage.setItem('addUser', newUsers);
            document.getElementById('user').value = '';
            document.getElementById('user').focus()
        } else {
            localStorage.setItem('addUser', formattedUser);
            $('.users').append(`<div class="user" id="${formattedUser}"> <input id="token" type="text" value="${formattedUser}" readonly> <button class="deleteUser" onclick="removeUser('${formattedUser}')"><i class="fas fa-trash"></i></button> </div>`)
            document.getElementById('user').value = '';
            document.getElementById('user').focus()
        }
    }
}

async function uploadCode() {
    const code = $('#codeThing').val();
    const securedUrls = localStorage.getItem('securedUrls');
    const time = localStorage.getItem('deleteTime');
    const instantDelete = localStorage.getItem('instantDelete');
    const allowedEditor = localStorage.getItem('addUser');
    const imageEmbeds = localStorage.getItem('imageEmbeds');
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, time, securedUrls, instantDelete, allowedEditor, imageEmbeds })
    }
    fetch('/saveCode', options)
        .then(res => res.json())
        .then(json => {
            if (json.status == 'success') {
                if (instantDelete == 'true') {
                    $('#codeThing').attr('readonly', true);
                    var lineCount = $("#codeThing").val().split("\n");
                    document.getElementById('lines').textContent = '';
                    for (var i = 1; i <= lineCount.length; i++) {
                        $('#lines').append(`${i.toString()} <br>`);
                    }
                    document.getElementById('submitCode').textContent = code;
                    $('#codeThing').val('');
                    if (localStorage.getItem('customURL') !== 'p') {
                        window.history.pushState({}, null, `${localStorage.getItem('customURL')}/${json.link.substring(3)}`)
                    } else {
                        window.history.pushState({}, null, json.link)
                    }
                    const link = json.link.substring(3)
                    document.title = `Document ${link}`
                    copyLink();
                    $('#messages').append('<li class="message success"><i class="fas fa-check" style="padding-right: 4px;"></i> Copied link!</li>');
                    document.querySelectorAll('pre code').forEach(block => {
                        hljs.highlightBlock(block);
                    });
                    localStorage.removeItem('addUser');
                } else {
                    if ($.trim($("#codeThing").val())) {
                        localStorage.removeItem('addUser');
                        location.href = localStorage.getItem('customURL') + '/' + json.link.substring(3) + '?copyLink=true'
                    } else {
                        $('#codeThing').focus();
                    }
                }
            }
        })
}

function copyLink() {
    const linkBox = document.createElement('textarea');
    linkBox.value = location.href;
    document.body.appendChild(linkBox);
    linkBox.select();
    document.execCommand('copy');
    document.body.removeChild(linkBox);
}