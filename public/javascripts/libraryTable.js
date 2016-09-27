var songID = m.prop()
var playlistName = m.prop()

var addToPlaylist = function(name, id) {
    console.log(id)
    m.request({
            method: 'POST',
            url: '/user/library',
            data: {
                name: name,
                id: id
            }
        })
        .then(function(data) {
            if (data.url) {
                window.location.href = data.url
            }
        })
}

var libraryTable = {
    view: function() {
        return [  m('table.table', [
                m('thead', [
                    m('th', 'Title'),
                    m('th', 'Author'),
                    m('th')
                ]),
                m('tbody', [
                    songs.map((s) => {
                        // console.log(JSON.stringify(s))
                        return m('tr', [
                            m('td', s.title),
                            m('td', s.author),
                            m('td', [
                                m('button.btn.btn-warning', {
                                    onclick: function() {
                                        songID(s._id)
                                    },
                                    'data-toggle': 'modal',
                                    'data-target': '#existingPlaylist'

                                }, 'Add to Playlist')
                            ])
                        ])
                    })
                ])
            ]),
            m('#existingPlaylist.modal.fade[role=dialog]', [
                m('.modal-dialog.modal-sm', [
                    m('.modal-content', [
                        m('.modal-header', [
                            m('h4', 'Your Playlist', [
                                m('button.btn.btn-default.pull-right', {
                                    'data-toggle': 'modal',
                                    'data-target': '#newPlaylist'
                                }, [
                                    m('span.glyphicon.glyphicon-plus')
                                ])
                            ])
                        ]),
                        m('.modal-body', [
                            m('ul[style=list-style-type:none]', [
                                playlists.map((playlist) => {
                                    return m('li', {
                                        onclick: function() {
                                            addToPlaylist(playlist.name, songID())
                                        }
                                    }, [
                                      m('a#playlist', playlist.name)
                                    ])
                                })
                            ])
                        ])
                    ])
                ])
            ]),
            m('#newPlaylist.modal.fade[role=dialog]', [
                m('.modal-dialog.modal-sm', [
                    m('.modal-content', [
                        m('.modal-header', [
                            m('h4', 'New Playlist')
                        ]),
                        m('.modal-body', [
                            m('label', 'Enter Playlist Name'),
                            m('input[name=playlist type=text]', {
                                onchange: m.withAttr('value', playlistName)
                            }),
                            m('br'),
                            m('button.btn.btn-success', {
                                onclick: function() {
                                    addToPlaylist(playlistName(), songID())
                                }
                            }, 'Create')
                        ])
                    ])
                ])
            ])
        ]
    }
}

m.mount(document.getElementById('library'), libraryTable)
