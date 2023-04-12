import { PanelPlugin } from '@grafana/data';
import LambdaSummaryPanel from './LambdaSummaryPanel';

export const plugin = new PanelPlugin(LambdaSummaryPanel).setPanelOptions((builder) => {
  builder.addTextInput({
    path: 'gaugeTitle',
    name: 'Gauge Title',
    defaultValue: 'Total Functions',
    settings: {
      placeholder: 'Title',
    },
  });
  builder.addTextInput({
    path: 'gaugeURL',
    name: 'Gauge API URL',
    defaultValue: '',
    settings: {
      placeholder: 'URL for API',
    },
  });
  builder.addTextInput({
    path: 'gaugeIMG',
    name: 'Gauge Base64 Code For Image',
    defaultValue:
      'iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY3MjVDM0MxQ0Y5MzExRURCMTU1QTA2M0QwODY1NkY2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY3MjVDM0MyQ0Y5MzExRURCMTU1QTA2M0QwODY1NkY2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjcyNUMzQkZDRjkzMTFFREIxNTVBMDYzRDA4NjU2RjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjcyNUMzQzBDRjkzMTFFREIxNTVBMDYzRDA4NjU2RjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz79TlmmAAAE9UlEQVR42uycTWsTQRiAp0sPtgjWUhQFFWPtoaIX216MN4WCemr14KFHQfID/Av+gYh6FPWg9aSCoDfrReNFMQetFRUUpfgBUuspzpPdN5lsd9NN293uZueFod02O8k8eb/mnZ3pqdVqqgMZ0m1Ut4Ju/b9/KvXrhyp//uD+8+P71hd/WlCxyt5C6/W+A+7PPfuVGhhUpW3b65dLuvFJqrotRu27JyKYYd2Ky39V/9s3qvyu6g5aX6datvS58A7qr3LkkCrpayDN6Ta/XjBbdZsGSOWZKr+YSz+MdpDGi0qNHWsAmtXtz1rATOg2hoY8vJtdIEGATp11NUhfVnR73gmYSfyIBlJ+VVFdKUfG6oBKnv95FAXMpNaOwr0bqhy389xswf9MzdRNawUcJ8B8cgFFoiZj9aLsRBgYHO0Y5pMHKCYcxszYPQYrwEzjaLvVp7QTxszYYeAHM0xIJvrkVbzI2+/lbA0wRfKUbgnJaxHGDgNYCJghSJG85V28BBatGQLMKPaVZ20xtcbzNaOAKTD3seKKx6IAmP48heco4RsmDqUDa0at5gQTh3qKxdEqMHGkyGSlKTBxLIZgcfzlSCtuidZqTJjGWATB0puGD0G5cceu1r99/7q5aUTvZiV3LG1QnB455P4eJOQTOkWvz2H4Pckkr3cztOPEGaUOH40Oj/b6pVJP7ienRYmCQTuo0APHzDSZn+ikqrFARy12YNBdD5LXApJr6iZoUdeAYWCnz7WaydPHriaEzFca9x0/6WoPkKZmlHpwJ/i+zIFBU0wo+AzMIooAgIb5jRfdv9HXv+V4NcdJwqdgPiJ821GhmMI93CviN8nMgeGblgGgKesxAe6VSqM48UyCwS9I9MGnrEVTgjRHQjd9h4X6VIMRn4DgaDdKzL7M98iM88XpSkiOakI41qAch0h161rTpMREeY+N0MTENIYPLWreSU05aiiWPiWMZwaMOfcheQsC1w7OalMAs0//PCszs2v/fAxTuXhJqZ27w81pNaca9xwv8bKDZMBozPkLK+GYPsZb5+neeow8ROifFvjh+KHcvl5/TCPQ5/gfTMxMVKKeIsKEMGiuJI4TOJiGGcWA8u1L0+f4IxV9Br1X6jVG1mcQZsUmFDTgyuWmJkjYDYJi3mMKfQrgOEoRsZqS+AczAjFAmfP4Q3MYlCA/JX3G5YNiBeN/gsKE4s9bokJBKEOEvUcmMl/UnEGbDjUsb8HfRClfkvFKKKfvuEqesUclsxzJvCaspBllgNwrcyP6jGMqkBgYBmA+woYTXku5gHtMBx73Q9mJVPBwkJiLDExWB8JKm34tkdKmaXpxJ36J1XwBQDlSKm8MVLQnSjHc1L4ksuGem1drtSTXljpZPvGDTWr5hC8m8XUlBoYpYEZpXXBL1JSCBo0G0FK5RKtSIABI23OAjmyXs9IUmNjHQMI0ho2VVloFJg67TS2KFbWekhNXlT2rIsknPmYp7jJhlsRjsQSYBamGWWlUBhcAU/U2a1sz6mtsO64CZpEN2nGtAWdJYOBtVl+UPGbO28Gea22BgXKPOGgkePOQMh/wyZt45RC0Zd4Eg8xiX+xgz5swZs+3zDYyX+P/HABRYVt/nsI3Y/WOMqgo4xAM/1yJAyAW2NafBzhyhIFyz3doOfzCHnrRwaEXIvaYlDZiD9ZZRexRTKtIbg7v+i/AAEIcQF8DSsu/AAAAAElFTkSuQmCC',
    settings: {
      placeholder: 'Base64 Code for image',
    },
  });
});
