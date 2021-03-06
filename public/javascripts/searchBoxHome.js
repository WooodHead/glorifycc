var searchBoxHome = function() {
    var searchString = m.prop('')
    var enter = function(elem, checkboxClass) {
        $(elem).keyup(function(e) {
            if (e.keyCode === 13) {
                $("#search-button").click()
            }
        })
    }
    var searchBoxHomeComponent = {
        view: function() {
            return m('#searchInput.input-group', {
                style: {
                    width: '100%'
                }
            }, [
                m('input.form-control[type=text]', {
                    placeholder: 'Search by title, lyrics or author',
                    onchange: m.withAttr('value', searchString),
                    config: function(elem, isInit, context) {
                        if (!isInit) {
                            enter(elem);
                        }
                    }
                }),
                m('span.input-group-btn', [
                    m('button#search-button.btn.btn-success', {
                        onclick: function() {
                            window.location.href = '/search?q=' + searchString()
                        }
                    }, [
                        m('i.glyphicon.glyphicon-search')
                    ])
                ])
            ])
        }
    }

    return {
        searchBoxHomeComponent: searchBoxHomeComponent
    }
}
