# Address-TypeAhead
This is an example of an address type-ahead using AJAX and Knockout.js.

# Components
## Search Bar
While typing in the search bar, on keyup, send an AJAX request to the web service, debounced on 200 ms. Only do this on alphanumeric or backspace.
```
$("#quick_search_input").keyup(debounce(function(e) {
    var charTyped = String.fromCharCode(e.which);
    if (/[a-z\d]/i.test(charTyped) || e.which == 8) {
        loadListings($("#quick_search_input").val());
    }
},200));
```
## AJAX Request
Send request to web service, then push response into array to get handled by Knockout.JS.
```
function ajaxListings(address) {
var results = [];

$.ajax({
    url: "https://www.capcenter.com/api/AddressServices/GetAddresses",
    data: { search: address },
    method: "get",
    dataType: "json",
    error: function (xhr, textStatus, errorThrown) {
        console.log(xhr);
    },
    success: function (content) {
        if (content.length > 0) {
            $.each(content, function (key, value) {
                if (content[key] != null) {
                    results.push(content[key]);
                }
            });
            listings.listings(results);
            if (results.length > 0) {
                $("#cityzipform-typeahead").slideDown();
            }
            else {
                $("#cityzipform-typeahead").hide();
            }

        }
    }
});

return results;
}
```
## JSON Response Structure
```
[  
   {  
      "type":"places",
      "listings":[  
         {  
            "place":"ARLINGTON, VA",
            "lastModified":"2015-07-29T21:50:17"
         }
      ]
   },
   {  
      "type":"neighborhoods",
      "listings":[  
         {  
            "place":"ARLINGTON OAKS",
            "lastModified":"2017-01-18T17:13:34"
         },
         {  
            "place":"ARLINGTON OAKS CONDO",
            "lastModified":"2017-01-18T16:41:34"
         }
         ...
      ]
   },
   {  
      "type":"listings",
      "listings":[  
         {  
            "id":"AR9758322",
            "address":"1300 ARLINGTON RIDGE RD S #411",
            "bedrooms":0,
            "bathCount":1,
            "bathHalf":0,
            "listPrice":169000,
            "lastModified":"0001-01-01T00:00:00"
         },
         ...
      ]
   }
]
```
## Knockout.JS
```
<div id="cityzipform-typeahead" class="typeahead" style="display:none;">
    <div class="subsection" data-bind="foreach: listings">
        <!-- ko if: listings.length > 0 -->
            <div class="heading">
                <!-- ko if: type.toLowerCase() == "listings"-->
                <span class="fa fa-home fa-lg fa-fw"></span>
                <!-- /ko -->
                <!-- ko if: type.toLowerCase() == "neighborhoods" || type.toLowerCase() == "places" -->
                <span class="fa fa-map-marker fa-lg fa-fw"></span>
                <!-- /ko -->
                <text data-bind="text: type"></text>
            </div>
            <!-- ko foreach: listings-->
                <!-- ko if: $parent.type.toLowerCase() == "listings"-->
                <a data-bind="attr: { href: '/PropertyListing/Property/' + id + '?1=1&Locality=' + $('#quick_search_input').val() + '&SortDirection=recent&ItemsPerPage=15&CurrentPageIndex=0'}">
                    <div class="listing">
                        <text data-bind="text: address + ' - ' + bedrooms + ' Bed | ' + bathCount + ' Bath | ' + formatCurrencyVal(listPrice)"></text>
                    </div>
                </a>
                <!-- /ko -->
                <!-- ko ifnot: $parent.type.toLowerCase() == "listings"-->
                <a data-bind="attr: { href: '/PropertyListing/SearchResultsPage?1=1&Locality=' + place + '&SortDirection=recent&ItemsPerPage=15&CurrentPageIndex=0#display-list'}">
                    <div class="listing">
                        <text data-bind="text: place + ' - Homes'"></text>
                    </div>
                </a>
                <!-- /ko -->
            <!-- /ko -->
        <!-- /ko -->
    </div>
</div>
```
