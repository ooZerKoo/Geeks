$(document).ready(function(){
    $('.toggleForm').click(function() {
        let id = $(this).attr('data-id')
        $('.adminForm[data-id!="'+id+'"]').hide()
        $('.adminForm[data-id="'+id+'"]').toggle()
    })
})