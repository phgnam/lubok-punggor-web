$(function() {
    // Initialize datatable
    $('#datatable-1').DataTable({
        responsive: true, // Reponsive support
        dom: 'Pfrtip',
        searchPanes:{
            cascadePanes: true,
            viewTotal: true
        },
        language:{
            searchPanes:{
                count: '{total} found',
                countFiltered: '{shown} / {total}'
            }
        }
    })
})
