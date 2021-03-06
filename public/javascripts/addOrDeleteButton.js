var addOrDeleteButtonComponent = (function() {
    var addSong = function(id, url, inLibrary) {
        m.request({
            method: 'POST',
            url: url,
            data: {
                id: id
            }
        }).then(function(res) {
            inLibrary(res.inLibrary)
        })
    }

    var deleteSong = function(id, url, inLibrary) {
        m.request({
            method: 'DELETE',
            url: url,
            data: {
                id: id
            }
        }).then(function(res) {
            inLibrary(res.inLibrary)
        })
    }

    /*
      args = {songID: args._id,
              url: '/',
              inLibrary: inLibrary
    }
    */
    var addOrDeleteButton = {
        controller: function(args) {
            this.buttonTitle = function() {
                var isInLibrary = _.includes(args.inLibrary(), args.songID);
                return isInLibrary ? 'Removing from Favorites...' : 'Adding to Favorites...';
            };
            this.buttonTxt = function() {
                var isInLibrary = _.includes(args.inLibrary(), args.songID);
                return m(isInLibrary ? 'i.glyphicon.glyphicon-heart' : 'i.glyphicon.glyphicon-heart-empty');
            }
            this.addOrDelete = function(){
                var isInLibrary = _.includes(args.inLibrary(), args.songID);
                if (isInLibrary) {
                    deleteSong(args.songID, args.url, args.inLibrary)
                } else {
                    addSong(args.songID, args.url, args.inLibrary)
                }
            }
            return this;
        },
        view: function(ctrl, args) {
            return m('div', [
                m('button.btn.btn-default', {
                    className: args.className,
                    title: ctrl.buttonTitle(),
                    onclick: function() {
                        if (!isLoggedIn) {
                            window.location.href = '/user/login'
                        } else {
                            ctrl.addOrDelete()

                            //we set the trigger to be manual so we need to
                            //manually show and hide the tooltip
                            $(this).tooltip('fixTitle');
                            $(this).tooltip('show')
                            setTimeout(() => {
                              $(this).tooltip('hide')
                            }, 2000);
                        }
                    },
                    config: function(elem, isInit) {
                        if (!isInit) {
                            $(elem).tooltip({
                                trigger: 'manual'
                            });
                        }
                    }
                }, [
                    ctrl.buttonTxt()
                ]),
                m('p', {
                    id: args.songID,
                    style: {
                        display: 'inline-block',
                        'font-style': 'italic',
                        'margin-left': '3px'
                    }
                })
            ])
        }
    }


    return {
        addOrDeleteButton: addOrDeleteButton
    }
})()
