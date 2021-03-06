//form component
/*
  obj = {
    song: ,
    url: ,
    readonly: ,
    submitButton: ,
    formID:
  }
  song is object
  url is the url for post method
  readonly is a flag to set whether the input readonly or not
  submitButton is a flag to determine whether to show submit button at the bottom of the form or not
  formID is the id for differentiation all element in orisong form and translation form
*/
function songForm(obj) {
    var title = m.prop(obj.song.title)
    var author = m.prop(obj.song.author)
    var translator = m.prop(obj.song.translator)
    var year = m.prop(obj.song.year)
    var lang = m.prop(obj.song.lang._id)
    var copyright = m.prop(obj.song.copyright)
    var lyrics = obj.song.lyrics;
    var youtubeLink = m.prop(obj.song.youtubeLink)

    //copypaste stores the current data for copy and paste box
    var copypaste = []
    var errors = [];

    function addSong() {
        m.request({
                method: 'post',
                url: obj.url,
                data: {
                    title: title(),
                    author: author(),
                    translator: translator(),
                    year: year(),
                    lang: lang(),
                    copyright: copyright(),
                    youtubeLink: youtubeLink(),
                    lyrics: lyrics
                }
            })
            .then(function(res) {
                if (res.errorMessages) {
                    errors = res.errorMessages;
                    $('#alert').show().delay(2000).fadeOut()
                    $('body').scrollTop(0);
                } else {
                    window.location.href = res.url
                }
            })
    }

    var addStanza = {
        view: function(ctrl, args) {
            return m('.form-group', [
                m('label', 'Stanza ' + (args.index + 1) + ':'),
                m('textarea.form-control', {
                    value: function() {
                        return args.stanza.reduce((prev, curr) => {
                            return prev + '\n' + curr
                        })
                    }(),
                    rows: '5', //the default size of stanza textbox
                    config: function(elem, isInit) {
                        if (!isInit) {
                            if (obj.readonly) {
                                $(elem).prop('readonly', true)
                            }
                            $(elem).bind('input propertychange', function() {
                                //make an array of string
                                var newStanza = $(elem).val() ? $(elem).val().split(/\r?\n/) : ''
                                    //update the object
                                lyrics.splice(args.index, 1, newStanza)
                            });
                        }
                    }
                }),
                m('button.btn.btn-default', {
                    disabled: args.length === 1 ? true : false,
                    onclick: function() {
                        lyrics.splice(args.index, 1)
                    }
                }, [
                    m('span.glyphicon.glyphicon-minus')
                ]),
                m('button.btn.btn-default', {
                    onclick: function() {
                        lyrics.splice(args.index + 1, 0, [''])
                    }
                }, [
                    m('span.glyphicon.glyphicon-plus')
                ])
            ])
        }
    }

    function copypasteModal() {
        return m('.modal.fade[role=dialog]', {
            id: 'copypaste' + obj.formID
        }, [
            m('.modal-dialog', [
                m('.modal-content', [
                    m('.modal-body', [
                        m('label', 'Lyrics:'),
                        m('textarea.form-control', {
                            rows: '25',
                            placeholder: 'Enter the lyrics of your new song separating each stanza with a blank line. Then press "Done" to start entering other details for the song.',
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    $(elem).bind('input propertychange', function() {
                                        copypaste = $(elem).val() ? $(elem).val().split(/\n\n|\/\//) : ''
                                        if (copypaste !== '') {
                                            copypaste = copypaste.map((cp) => {
                                                return cp.split(/\n|\//)
                                            })
                                        }
                                    });

                                    // auto-open this modal if appropriate
                                    if (obj.song.title === '') {
                                      $('#copypaste' + obj.formID).modal('show');
                                    }
                                }
                            }
                        }),
                        m('div', {
                          style: {
                            'text-align': 'right',
                            'margin-top': '5px'
                          }
                        }, [
                          m('button.btn.btn-default', {
                              onclick: function() {
                                  $('#copypaste' + obj.formID).modal('hide')
                                  $('#copypaste' + obj.formID).find('textarea').val('')
                              }
                          }, 'Cancel'),
                          m.trust('&nbsp;'),
                          m('button.btn.btn-primary', {
                              onclick: function() {
                                  var isConfirmed = true;
                                  $('#stanzas' + obj.formID).children().each(function() {
                                      if ($(this).find('textarea').val().replace(/\s/g, '') !== '') {
                                          isConfirmed = confirm('Do you want to overwrite your existing lyric ?')
                                          return;
                                      }
                                  })
                                  if (isConfirmed) {
                                      lyrics = copypaste
                                      $('#copypaste' + obj.formID).modal('hide')
                                      $('#copypaste' + obj.formID).find('textarea').val('')
                                  }
                              }
                          }, 'Done')
                        ])
                    ])
                ])
            ])
        ])
    }

    function displayError() {
        if (!_.isEmpty(errors)) {
            return m('#alert.alert.alert-danger', {
                config: function(elem, isInit) {
                    if (!isInit) {
                        $(elem).delay(3000).fadeOut()
                    }
                }
            }, [
                errors.map((error) => {
                    return m('p', error)
                })
            ])
        }
    }

    var songFormComponent = {
        view: function() {
            return [
                displayError(),
                m('div', {
                    style: {
                        'font-size': '15px'
                    }
                }, [
                    m('.form-group', [
                        m('label', 'Title*'),
                        m('input.form-control', {
                            placeholder: 'Enter the title of the song in the selected language',
                            value: title(),
                            onchange: m.withAttr('value', title),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    if (obj.readonly) {
                                        $(elem).prop('readonly', true)
                                    }
                                }
                            }
                        })
                    ]),
                    m('.form-group', [
                        m('label', 'Author*'),
                        m('input.form-control', {
                            placeholder: 'The author(s) and/or composer(s) of the song',
                            value: author(),
                            onchange: m.withAttr('value', author),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    if (obj.readonly) {
                                        $(elem).prop('readonly', true)
                                    }
                                }
                            }
                        })
                    ]),
                    m('.form-group', [
                        m('label', 'Translator'),
                        m('input.form-control', {
                            placeholder: 'The translator of the song',
                            value: translator(),
                            onchange: m.withAttr('value', translator),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    if (obj.readonly) {
                                        $(elem).prop('readonly', true)
                                    }
                                }
                            }
                        })
                    ]),
                    m('.form-group', [
                        m('label', 'Publisher and/or year'),
                        m('input.form-control', {
                            placeholder: 'If the song has a publisher, include the publisher and year',
                            value: year(),
                            onchange: m.withAttr('value', year),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    if (obj.readonly) {
                                        $(elem).prop('readonly', true)
                                    }
                                }
                            }
                        })
                    ]),
                    m('.form-group', [
                        m('label', 'Language*'),
                        m('select.form-control', {
                            onchange: m.withAttr('value', lang),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    $(elem).val(lang())
                                    if (obj.readonly) {
                                        $(elem).prop('disabled', true)
                                    }
                                }
                            }
                        }, [
                            availableLanguages.map((lang) => {
                                return m('option', {
                                    'value': lang._id
                                }, lang.label)
                            })
                        ])
                    ]),
                    m('.form-group', [
                        m('label', 'Copyright*'),
                        m('select.form-control.capitalize', {
                            onchange: m.withAttr('value', copyright),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    $(elem).val(copyright())
                                    if (obj.readonly) {
                                        $(elem).prop('disabled', true)
                                    }
                                }
                            }
                        }, [
                            copyrightTypes.map((cp) => {
                                return m('option', cp)
                            })
                        ])
                    ]),
                    m('.form-group', [
                        m('label', 'Youtube Video Link'),
                        m('input.form-control', {
                            placeholder: 'A link to a video so users can hear the song',
                            value: youtubeLink(),
                            onchange: m.withAttr('value', youtubeLink),
                            config: function(elem, isInit) {
                                if (!isInit) {
                                    if (obj.readonly) {
                                        $(elem).prop('readonly', true)
                                    }
                                }
                            }
                        })
                    ]),
                    m('div', {
                        id: 'stanzas' + obj.formID
                    }, [
                        lyrics.map((stanza, i, arr) => {
                            return m(addStanza, {
                                stanza: stanza,
                                index: i,
                                length: arr.length
                            })
                        })
                    ])
                ]),
                function() {
                    if (obj.submitButton) {
                        return m('button.btn.btn-primary', {
                            onclick: function() {
                                addSong()
                            }
                        }, 'Submit')
                    }
                }(),
                copypasteModal()
            ]
        }
    }
    return {
        songFormComponent: songFormComponent
    }
}
