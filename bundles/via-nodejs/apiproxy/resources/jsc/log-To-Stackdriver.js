// log-To-Stackdriver.js
// ------------------------------------------------------------------
//
// Send a POST to stackdriver without waiting for a response.
//
// created: Wed Feb 15 16:28:55 2017
// last saved: <2017-February-28 09:50:26>

var variableNameRe = "[^ \t\n\"',/\\\\]+?"; // non-greedy capture
var varPrefixRe = '{';
var varSuffixRe = '}';
var variableRegex = new RegExp( varPrefixRe + '(' + variableNameRe + ')' + varSuffixRe, 'g');

function fillTemplate(template) {
  // substitute all names surrounded by {curly_braces} in the template
  // with the value of the corresponding context variables
  var match;
  while ((match = variableRegex.exec(template)) !== null) {
    var variableName = match[1];
    var value = context.getVariable(variableName);
    if (value && value !== '') {
      template = template.replace('{' + variableName + '}', value);
    }
    else {
      template = template.replace('{' + variableName + '}', 'n/a');
    }
  }
  return template + ''; // coerce to JS String
}

// fire and forget
var payload = fillTemplate(properties.payload);
var headers = {
      'Content-Type' : 'application/json',
      'Authorization' : fillTemplate(properties.authz_header)
    };
var url = fillTemplate(properties.endpoint);
var req = new Request(url, 'POST', headers, payload);
var exchange = httpClient.send(req);
