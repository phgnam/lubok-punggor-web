$(function() {
    // Initialize datatable
    $('#datatable-1').DataTable({
        responsive: true, // Reponsive support
        // Custom row rendering methods
        createdRow: (row, data, index) => {
            const column = 5
            let cell = $(row).children('td').eq(column)
            let classes = data[column] < 40 ? 'text-primary font-weight-bold' : 'text-danger font-weight-bold'

            cell.addClass(classes)
        }
    })
})
