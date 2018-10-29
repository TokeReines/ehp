angular
    .module('app')
    .controller('ProductsController', ProductsController);

ProductsController.$inject = ['kitchenService', 'messageService', '$state', '$scope', 'productService', 'fileReader', 'Upload', '$http'];

function ProductsController(kitchenService, messageService, $state, $scope, productService, fileReader, $upload, $http) {
    var vm = this;
    vm.defaultSrc = "/assets/img/administration.jpg";
    vm.service = productService;
    vm.products = productService.products();
    vm.safeProducts = productService.products();
    vm.state = $state;

    vm.openEditModal = function (prod) {
        vm.editingProduct = prod;
        $('#editProductModal').openModal();
    };

    vm.openDeleteModal = function (prod) {
        vm.deleteProduct = prod;
        $('#deleteProductModal').openModal();
    };

    vm.createProduct = function (prod) {
        var file = vm.file;
        file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload/",
            fields: {
                upload_preset: $.cloudinary.config().upload_preset,
                tags: 'produkter',
                context: 'photo=' + file.name
            },
            file: file
        }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
        }).success(function (data, status, headers, config) {
            prod.imgId = data.public_id;
            productService.create(prod);
            Materialize.toast(prod.name + " tilføjet", 2000);
            $('#addProductModal').closeModal();
        }).error(function (data, status, headers, config) {
            file.result = data;
            Materialize.toast("Der skete en fejl: " + status, 2000);
        });
    };

    vm.editProduct = function (prod) {
        var file = vm.file;
        if (!file) {
            productService.update(prod);
            return;
        }
        file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            fields: {
                upload_preset: $.cloudinary.config().upload_preset,
                tags: 'produkter',
                context: 'photo=' + file.name
            },
            file: file
        }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
        }).success(function (data, status, headers, config) {
            prod.imgId = data.public_id;
            productService.update(prod);
            Materialize.toast(prod.name + " ændret", 2000);
            $('#editProductModal').closeModal();
        }).error(function (data, status, headers, config) {
            file.result = data;
            Materialize.toast("Der skete en fejl: "+status, 2000);
        });
    }

    vm.purchasePriceChange = function (prod) {
        if (prod.markup !== undefined) {
            // Round to 2 decimals
            prod.retailPrice = prod.purchasePrice + removeButTwoDecimals(prod.markup / 100 * prod.purchasePrice);
        }
    };

    vm.markupChange = function (prod) {
        if (prod.purchasePrice !== undefined) {
            prod.retailPrice = prod.purchasePrice + removeButTwoDecimals(prod.markup / 100 * prod.purchasePrice);
        }
    };

    vm.retailPriceChange = function (prod) {
        if (prod.purchasePrice !== undefined) {
            prod.markup = removeButTwoDecimals(100 * ((prod.retailPrice / prod.purchasePrice) - 1));
        }
    };

    function removeButTwoDecimals(val) {
        return Math.round(val * 100) / 100;
    }

    vm.getFileNewProd = function (e) {
        vm.file = e.files[0];
        vm.progress = 0;
        vm.uploading = true;
        vm.imageSrc = "";
        vm.defaultSrc = "";
        fileReader.readAsDataUrl(vm.file, $scope)
            .then(function (result) {
                vm.newProdImgSrc = result;
                vm.uploading = false;

            });
    };

    vm.getFileEditProd = function (e) {
        vm.file = e.files[0];
        vm.progress = 0;
        vm.uploading = true;
        vm.imageSrc = "";
        vm.defaultSrc = "";
        fileReader.readAsDataUrl(vm.file, $scope)
            .then(function (result) {
                vm.editProdImgSrc = result;
                vm.uploading = false;
            });
    };

    $scope.$on("fileProgress", function (e, progress) {
        vm.progress = progress.loaded / progress.total * 100;
    });
}