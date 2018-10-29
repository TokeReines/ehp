angular
    .module('app')
    .controller('ResidentsController', ResidentsController);

ResidentsController.$inject = ['auth', 'userService', '$scope', 'fileReader', 'Upload'];

function ResidentsController(auth, userService, $scope, fileReader, $upload) {
    var vm = this;
    vm.service = userService;
    vm.residents = userService.users();
    vm.safeResidents = userService.users();

    vm.remove = function (resident) {
        if (!resident.authId) {
            vm.safeResidents.$remove(resident);
        } else {

        }

    }
    vm.editResident = function (resident) {
        var file = vm.file;
        if (!file) {
            userService.update(resident);
            return;
        }
        file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            fields: {
                upload_preset: $.cloudinary.config().upload_preset,
                tags: 'beboere',
                context: 'photo=' + file.name
            },
            file: file
        }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
        }).success(function (data, status, headers, config) {
            resident.imgId = data.public_id;
            userService.update(resident);
        }).error(function (data, status, headers, config) {
            file.result = data;
        });
    }

    vm.openEditModal = function (resident) {
        vm.editingResident = resident;
        if (resident.imgId)
            vm.editingResidentImgSrc = "";
        else
            vm.editingResidentImgSrc = "/assets/img/avatar.png";
        $('#editResidentModal').openModal();
    };

    vm.openDeleteModal = function (resident) {
        vm.deleteResident = resident;
        $('#deleteResidentModal').openModal();
    };

    $("#file-input").on("change", function(e) {
        vm.getFile(e.currentTarget);
    });

    vm.getFile = function (e) {
        vm.file = e.files[0];
        vm.progress = 0;
        vm.uploading = true;
        fileReader.readAsDataUrl(vm.file, $scope)
            .then(function (result) {
                vm.editingResidentImgSrc = result;
                vm.uploading = false;
            });
    };

    $scope.$on("fileProgress", function (e, progress) {
        vm.progress = progress.loaded / progress.total * 100;
    });
}