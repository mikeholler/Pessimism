// ==UserScript==
// @name s/optimism/pessimism/g
// @version 1.23
// @description Replaces instances of good, better, and best with bad, worse, and worst, respectively.
// @author Michael Holler
// @match *://*/*
// @license MIT License
// 
// 
// ==/UserScript==

// Which letters in 'good' get replaced with which letters in 'bad'
var good_subs = {
    'g':'b', 'G':'B',
    'oo':'a', 'oO':'a', 'Oo':'A', 'OO':'A'
    };

// Which letters in 'better' get replaced with which letters in 'worse'
var better_subs = {
    'b':'w', 'B':'W',
    'e':'o', 'E':'O',
    'tt':'rs', 'tT':'rS', 'Tt':'Rs', 'TT':'RS',
    'er':'e', 'eR':'e', 'Er':'E', 'ER':'E'
    };
    
// Which letters in 'best' get replaced with which letters in 'worst'
var best_subs = {
    'b':'w', 'B':'W',
    'e':'or', 'E':'OR'
    };
    
var optimism_subs = {
    'o':'p', 'O':'P',
    'p':'e', 'P':'E',
    't':'ss', 'T':'SS'
    };
    
// Transform all instances of 'good', 'better', and 'best', into 'bad', 'worse',
// and 'worst', respectively.
function pessimism(str){
    str = str.replace(/(g)(oo)(d)/ig, function(match,g,oo,d){
        return good_subs[g] + good_subs[oo] + d
    })
    
    str = str.replace(/(b)(e)(tt)(er)/ig, function(match,b,e,tt,er){
        return better_subs[b] + better_subs[e] + better_subs[tt] + better_subs[er]
    })
    
    str = str.replace(/(b)(e)(st)/ig, function(match,b,e,st){
        return best_subs[b] + best_subs[e] + st
    })
    
    str = str.replace(/(o)(p)(t)(imism|imistic|imist)/ig, function(match,o,p,t,end){
        return optimism_subs[o] + optimism_subs[p] + optimism_subs[t] + end
    })
    
    return str
}

var TEXT_NODE = Node.TEXT_NODE || 3
var replacingContent = false

function replaceTextContent(node) {
  //flag that content is being replaced so the event it generates
  //won't trigger another replacement
  replacingContent = true
  node.textContent = pessimism(node.textContent)
  replacingContent = false
}

function changeTextNodes(node) {
  var length, childNodes
  //If this is a text node, leopardize it
  if (node.nodeType == TEXT_NODE) {
    replaceTextContent(node)
  //If this is anything other than a text node, recurse any children
  } else {
    childNodes = node.childNodes
    length = childNodes.length
    for(var i=0; i<length; ++i){
      changeTextNodes(childNodes[i])
    }
  }
}

function insertion_listener(event) {
  //change any new text nodes in a node that is added to the body
  changeTextNodes(event.target)
}

function cdm_listener(event) {
  //avoid infinite loop by ignoring events triggered by replacement
  if(!replacingContent){
    replaceTextContent(event.target)
  }
}

changeTextNodes(document.body)
document.title = pessimism(document.title)
document.body.addEventListener ("DOMNodeInserted", insertion_listener, false)
document.body.addEventListener ("DOMCharacterDataModified", cdm_listener, false)
