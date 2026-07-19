const employeeAccess = {
    list: {
        headTitle: 'Access Categories',
        layoutTitle: 'Employee Access',
        layoutDescription: 'Manage your employee access list',
        searchPlaceholder: 'Search categories...',
        createLabel: 'Category',
        columnName: 'Category Name',
        columnEmployeeCount: 'Registered Employees',
        columnAction: 'Action',
        notFoundPrefix: 'Category',
        notFoundSuffix: 'not found',
        emptyState: 'No categories yet, create one to get started',
        employeeCountSuffix: 'employees',
        itemLabel: 'Categories',
        deleteConfirm: 'Delete this category? Linked employee roles will not be deleted.',
    },
    createModal: {
        title: 'Create New Category',
        closeAriaLabel: 'Close',
        nameLabel: 'Category Name',
        namePlaceholder: 'e.g. Administrator, Cashier...',
        cancel: 'Cancel',
        submitting: 'Saving...',
        submitLabel: 'Create Category',
    },
    editModal: {
        title: 'Edit Category',
        closeAriaLabel: 'Close',
        nameLabel: 'Category Name',
        nameAriaLabel: 'Category name',
        cancel: 'Cancel',
        submitting: 'Saving...',
        submitLabel: 'Save Changes',
    },
    actionsMenu: {
        edit: 'Edit',
        delete: 'Delete',
    },
};

export default employeeAccess;