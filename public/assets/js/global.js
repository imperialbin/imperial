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
        console.log(localStorage.getItem('customURL'))
    }
    if (localStorage.getItem('customURL')) {
        $('#customURL').val(localStorage.getItem('customURL'));
        $('#previewURL').text(`(https://www.imperialb.in/${document.getElementById('customURL').value}/documentID)`);
    } else {
        $('#customURL').val('p');
    }
    $('#day').val(localStorage.getItem('deleteTime'));
}

function duplicate() {
    localStorage.setItem('duplicatePaste', $('#codeThing').val());
    location.href = '/';
}

function toggleCompareDocuments() {
    $('#compareDocuments').addClass('active');
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
function cancelSettings() {
    $('.pasteSettings').removeClass('active');
}

function editPaste() {
    $('.editButton').remove();
    $('#edit').append('<button id="icon" class="editButton editButtonActive" onclick="postEditPaste(); emitEditPost()"><i class="fas fa-check"></i></button>');
    $('#box').css('display', 'none');
    $('#codeThing').css('display', 'block');
    $('#codeThing').focus();
}
function postEditPaste() {
    const code = $('#codeThing').val();
    const documentId = location.href.split('/').pop() || location.href.split('/').pop();
    if (!code == '') {
        $('.editButton').remove();
        $('#edit').append('<button id="icon" class="editButton" onclick="editPaste()"><i class= "fas fa-pencil-alt" ></i ></button >');
        console.log('posting paste');
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, documentId })
        }
        fetch('/editCode', options)
            .then(res => res.json())
            .then(json => {
                if (json.status == 'success') {
                    document.getElementById('submitCode').textContent = code;
                    $('#box').css('display', 'block');
                    $('#codeThing').css('display', 'none');
                    var lineCount = $("#codeThing").val().split("\n");
                    document.getElementById('lines').textContent = '';
                    for (var i = 1; i <= lineCount.length; i++) {
                        $('#lines').append(`${i.toString()} <br>`);
                    }
                    if ($('.message, .success').length === 0) {
                        $('#messages').append('<li class="message success"><i class="fas fa-check" style="padding-right: 9px;"></i> Edited post!</li>');
                    }
                    document.querySelectorAll('pre code').forEach(block => {
                        hljs.highlightBlock(block);
                    });
                }
            })
    }
}