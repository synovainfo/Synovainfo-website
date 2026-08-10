@props(['targetId', 'interval' => 15])

<div x-data="{
    init() {
        setInterval(() => this.fetchData(), {{ $interval * 1000 }});
    },
    fetchData() {
        fetch(window.location.href, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Auto-Refresh': 'true'
            }
        })
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const target = doc.getElementById('{{ $targetId }}');
            if (target) {
                document.getElementById('{{ $targetId }}').innerHTML = target.innerHTML;
            }
        })
        .catch(error => console.error('Auto-refresh failed:', error));
    }
}"></div>
