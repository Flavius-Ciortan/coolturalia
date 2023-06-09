'use strict';
if (oaData) {
    const eventContainer = document.querySelector('[data-container-id="oa-wrapper"]');
    eventContainer.insertAdjacentHTML('afterbegin', '<div class="oa-notice-wrapper"></div>');
    window.oa = {
        res: oaData.res,
        agendaUid: oaData.agendaUid,
        locale: oaData.locale,
        query: window.location.search,
        onLoad: async (values, aggregations, filtersRef, _form) => {
            try {
                const result = await oa.getEvents({ ...values, size: 0 }, aggregations);
                filtersRef.updateFiltersAndWidgets(values, result);
            } catch (e) {
                console.log('onLoad error: ', e);
            }
        },
        onFilterChange: async (values, aggregations, filtersRef, _form) => {
            eventContainer.insertAdjacentHTML('afterbegin', oaData.overlayHtml);
            try {
                if( oaData.isSingle && oaData.listUrl ){
                    if( values.context ) delete values.context;
                    const url = `${oaData.listUrl}?${Qs.stringify(values)}`;
                    window.location.href = url;
                } else {
                    const result = await oa.getEvents(values, aggregations);
                    if (result.success && result.html) {
                        oa.updateHTML(eventContainer, result.html);
                        const url = `${oaData.listUrl}`;
                        history.pushState(null, document.title, url);
                        filtersRef.updateLocation(values);
                        filtersRef.updateFiltersAndWidgets(values, result); 
                    }
                }
            } catch (e) {
                console.log('onFilterChange error: ', e);
            }
        },
        getEvents: async (values, aggregations = []) => {
            const formData = new FormData();
            formData.append('nonce', oaData.nonce);
            formData.append('postId', oaData.postId);
            formData.append('action', oaData.action);
            formData.append('view', oaData.view);
            formData.append('query', JSON.stringify({...values, aggregations}));

            const result = await fetch(oaData.ajaxUrl, {
                method: "POST",
                body: formData
            }).then(response => response.json());
            return result;
        },
        updateHTML(element, html) {
            element.innerHTML = html;
        }
    };
}