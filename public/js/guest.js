function guest(config) {
    /* define root selector */
    var $this = this;

    /* set selector */
    this.wrapper = jQuery(config.wrapper);
    this.endpoint = config.endpoint;
    this.modalForm = $('#modal-form');
    this.modalDelete = $('#modal-delete');
    this.page = 1;
    this.guestId = null;
    this.credentials = {
        email: config.credentials.email,
        password: config.credentials.password
    }
    this.accessToken = null;

    /* boot method */
    this.run = function (root) {
        $this.fetch()

        /* show loged in user */
        $this.wrapper.find('#login-as b').html($this.accessToken.user.name);
        $this.wrapper.find('#login-as').removeClass('hidden');

        /* add button listener */
        $('.btn-add').click(function () {
            $this.showAdd();
        });

        /* edit button listener */
        $this.wrapper.on('click', '.btn-edit', function () {
            $this.guestId = $(this).closest('tr').find('input.guest_id').val();
            $this.showEdit();
        });

        /* delete button listener */
        $this.wrapper.on('click', '.btn-delete', function () {
            $this.guestId = $(this).closest('tr').find('input.guest_id').val();
            $this.modalDelete.modal('show');
        });

        /* delete all button listener */
        $('#btn-delete-all').click(function (e) {
            e.preventDefault();

            var allChecked = $this.wrapper.find('input.guest_id')
                .filter(':checked');

            $this.guestId = null;
            var list = [];
            allChecked.each(function () {
                if ($(this).val()) list.push($(this).val());
            });
            $this.guestId = list.join(',');

            if ($(this).hasClass('dim') === false) {
                $this.modalDelete.modal('show');
            }
        });

        /* confirm delete button listener */
        $this.wrapper.on('click', '.btn-confirm-delete', function () {
            $this.delete();

            /* uncheck checkall checkbox */
            $this.wrapper.find('#checkall').prop('checked', false);
        });

        /* pagination listener */
        $this.wrapper.on('click', '.paging', function (e) {
            e.preventDefault();

            var page = parseInt($(this).data('page'));
            if (page > 0) {
                /* set page state */
                $this.page = page;

                /* refetch dta */
                $this.fetch(page);
            }
        });

        /* checkall checkbox listener */
        $('#checkall').click(function () {
            var isChecked = $(this).prop('checked');
            $this.wrapper.find('input.guest_id').prop('checked', isChecked);
        });

        /* single checkbox listener */
        $this.wrapper.on('click', 'input.guest_id', function () {
            var totalCheckbox = $this.wrapper.find('input.guest_id');
            var allChecked = totalCheckbox.filter(':checked');

            if (totalCheckbox.length == allChecked.length) {
                $('#checkall').prop('checked', true);
            } else {
                $('#checkall').prop('checked', false);
            }
        });

        /* checkall + single checkbox listener */
        $this.wrapper.on('click', 'input.guest_id, #checkall', function () {
            var allChecked = $this.wrapper.find('input.guest_id')
                .filter(':checked');

            if (allChecked.length > 0) {
                $('#btn-delete-all').removeClass('dim');
            } else {
                $('#btn-delete-all').addClass('dim');
            }
        });

        /* modal delete listeter */
        $('#modal-delete').on('show.bs.modal', function (e) {
            console.log($this.guestId);
            if ($this.guestId.indexOf(',') !== -1) {
                $(this).find('.text').html('Are you sure you want to delete these Records?');
            } else {
                $(this).find('.text').html('Are you sure you want to delete this Record?');
            }
        });
    }

    /* global request handler */
    this.request = function (method, url, data) {
        var result = [];

        $.ajax({
            async: false,
            type: method,
            dataType: 'json',
            url: url,
            data: data,
            beforeSend: function (xhr) {
                if($this.accessToken){
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $this.accessToken.access_token.token);
                }
            },
            success: function (data, status, xhr) {
                result = data;
            },
            done: function () {

            }
        });

        return result;
    }

    /* fetching data from server*/
    this.fetch = function (page = 1) {
        var url = config.endpoint + '/guests'
        var guests = $this.request('GET', url, { page: page });
        $this.buildGuestList(guests.data);

        $('#total').html(guests.data.total);

        /* user remove all records on current page, the current list would be blank. so we have to fetch 1st page */
        if (guests.data.data.length == 0 && guests.data.total > 0) {
            this.fetch(1)
        }
    }

    /* build guest list in table record */
    this.buildGuestList = function (guests) {
        /* build guest list */
        var result = '';

        if (guests.data.length > 0) {
            $.each(guests.data, function (index, guest) {
                result += `<tr>
                            <td><input type="checkbox" class="checkthis guest_id" name="guests[]" value="` + guest._id + `"/></td>
                            <td>` + guest.first_name + `</td>
                            <td>` + guest.last_name + `</td>
                            <td>` + guest.address + `</td>
                            <td><a href="mailto:` + guest.email + `">` + guest.email + `</a></td>
                            <td>` + guest.contact + `</td>
                            <td>
                                <p data-placement="top" data-toggle="tooltip" title="Edit">
                                    <button class="btn btn-primary btn-xs btn-edit" data-title="Edit">
                                        <span class="glyphicon glyphicon-pencil"></span>
                                    </button>
                                </p>
                            </td>
                            <td>
                                <p data-placement="top" data-toggle="tooltip" title="Delete">
                                    <button class="btn btn-danger btn-xs btn-delete" data-title="Delete">
                                        <span class="glyphicon glyphicon-trash"></span>
                                    </button>
                                </p>
                            </td>
                        </tr>`;
            });
        } else {
            result = `<tr>
                            <td colspan="8"><p style="text-align:center;padding:50px 0;">Click Add button to add a new guest</p></td>
                      </tr>`;
        }

        $this.wrapper.find('table tbody').html(result);

        /* build pagination */
        var pagination = $this.buildPagination({
            lastPage: guests.lastPage,
            page: guests.page,
            perPage: guests.perPage,
            total: guests.total
        });
        $this.wrapper.find('.pagination-box').html(pagination);
    }

    /* pagination */
    this.buildPagination = function (config) {
        var result = '';
        var list = '';
        var prev = (config.page - 1);
        var next = (config.page + 1);

        if (prev < 1) {
            prev = 0;
        }

        if (next > config.lastPage) {
            next = 0;
        }

        for (var i = 1; i <= config.lastPage; i++) {
            list += `<li class="` + (i == config.page ? 'active' : '') + `">
                        <a href="#" class="paging" data-page="` + i + `">` + i + `</a>
                    </li>`;
        }

        if (list) {
            result = `<ul class="pagination">
                        <li class="` + (config.page == 1 ? 'disabled' : '') + `">
                            <a href="#" class="paging" data-page="` + prev + `"><span class="glyphicon glyphicon-menu-left"></span></a>
                        </li>
                        ` + list + `
                        <li class="` + (config.page == config.lastPage ? 'disabled' : '') + `">
                            <a href="#" class="paging" data-page="` + next + `"><span class="glyphicon glyphicon-menu-right"></span></a>
                        </li>
                      </ul>`;
        }

        return result;
    }

    /* sho add form */
    this.showAdd = function () {
        /* set modal */
        $this.modalForm.find('#heading').html('Add Guest');

        /* reset form */
        $this.modalForm.find('form').trigger('reset');

        /* form validate */
        $this.modalForm.find('form')
            .validate({
                submitHandler: function (form) {
                    $this.store()
                }
            })
            .resetForm();

        /* show modal */
        $this.modalForm.modal('show');
    }

    /* show edit form */
    this.showEdit = function () {
        /* set modal */
        $this.modalForm.find('#heading').html('Edit guest');

        /* reset form */
        $this.modalForm.find('form').trigger('reset');

        /* form validate */
        $this.modalForm.find('form')
            .validate({
                submitHandler: function (form) {
                    $this.update()
                }
            })
            .resetForm();

        /* perform ajax request to fetch data detail */
        var url = $this.endpoint + '/guests/' + $this.guestId;
        var guest = $this.request('GET', url);

        if (guest.status == 'success') {
            /* show modal */
            $this.modalForm.modal('show');

            /* fill data to form */
            $this.modalForm.find('input[name="id"]').val(guest.data._id);
            $this.modalForm.find('input[name="first_name"]').val(guest.data.first_name);
            $this.modalForm.find('input[name="last_name"]').val(guest.data.last_name);
            $this.modalForm.find('input[name="email"]').val(guest.data.email);
            $this.modalForm.find('input[name="contact"]').val(guest.data.contact);
            $this.modalForm.find('textarea[name="address"]').val(guest.data.address);
        } else {
            $this.snackbar("Please try again")
        }
    }

    /* handle add new guest */
    this.store = function () {
        var data = $this.modalForm.find('form').serialize();
        var url = config.endpoint + '/guests'
        var guest = $this.request('POST', url, data);

        if (guest.status == 'success') {
            $this.snackbar("Data saved successfully")
            $this.fetch()
            $this.modalForm.modal('hide');
        } else {
            $this.showError(guest.data);
        }
    }

    /* handle update guest */
    this.update = function () {
        var form = $this.modalForm.find('form');
        var data = form.serialize();
        var url = $this.endpoint + '/guests/' + form.find('input[name="id"]').val();
        var guest = $this.request('PUT', url, data);

        if (guest.status == 'success') {
            $this.snackbar("Data saved successfully");
            $this.fetch($this.page);
            $this.modalForm.modal('hide');
        } else {
            $this.showError(guest.data);
        }
    }

    /* handle delete guest */
    this.delete = function () {
        var url = $this.endpoint + '/guests/' + $this.guestId;
        var req = $this.request('DELETE', url, []);

        if (req.status == 'success') {
            $this.snackbar("Data has been deleted successfully");
            $this.fetch($this.page);
        } else {
            $this.snackbar('Failed');
        }

        $this.modalDelete.modal('hide');
    }

    /* notification popup */
    this.snackbar = function (message, is_error = false) {
        if ($(document).find('#snackbar').length == 0) {
            $('body').append('<div id="snackbar"></div>');
        }

        if (is_error) {
            $('#snackbar').addClass('snackbar-error');
        }

        $('#snackbar').html(message).addClass("show");
        setTimeout(function () {
            $('#snackbar').removeClass('show')
                .removeClass('snackbar-error');
        }, 4000);
    }

    /* parse error response */
    this.showError = function (errors) {
        $.each(errors, function (index, e) {
            $this.snackbar(e.message, true)
            $this.wrapper.find('input[name="' + e.field + '"]').focus();

            $this.wrapper.find('input[name="' + e.field + '"]').css('border', '1px solid #ff0000');
            setTimeout(function () {
                $this.wrapper.find('input[name="' + e.field + '"]').css('border', '1px solid #ccc');
            }, 4000);

            return;
        });
    }

    this.login = function () {
        var url = config.endpoint + '/auth/login';
        var login = this.request('POST', url, $this.credentials);

        $this.accessToken = login.data;
    }
}