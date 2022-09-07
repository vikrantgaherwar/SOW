import React, { Fragment } from 'react';

import Image_001 from '../img/tips/Image_001.jpg'
import Image_002 from '../img/tips/Image_002.jpg'
import Image_003 from '../img/tips/Image_003.jpg'
import Image_004 from '../img/tips/Image_004.jpg'
import Image_005 from '../img/tips/Image_005.jpg'
//import Image_006 from '../img/tips/Image_006.jpg'
import Image_007 from '../img/tips/Image_007.jpg'
import Image_008 from '../img/tips/Image_008.jpg'
import Image_009 from '../img/tips/Image_009.jpg'
import Image_010 from '../img/tips/Image_010.jpg'
import Image_011 from '../img/tips/Image_011.jpg'
import Image_012 from '../img/tips/Image_012.jpg'
import Image_013 from '../img/tips/Image_013.jpg'

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        };
};  
  render() {
    return (  
        <Fragment>
        <div className="modal fade" id="TipsDataModal" role="dialog" aria-labelledby="TipsDataModal" aria-hidden="true">
                <div className="modal-dialog hpesc-data-modal" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h4 className="modal-title" id="TipsDataModal"><strong>Using A&amp;PS Delta Solution</strong></h4>
                    <button type="button" className="close" data-dismiss="modal" translate="no" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div className="modal-body">
                    <div className="card-body ml-2">
                    <div className="container">
                        <table className="pl-3 table table-sm" width="100%" cellSpacing="0" cellPadding="0" border="0" align="center">
                        <tbody>
                        <tr>
                            <td colSpan="2" align="left"><h5>1 Basic Search</h5></td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><strong>1.1 Exact Match or Phrase Match</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left">Enclose the phrase in double quotes.</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><strong>For example: </strong>“Veeam software”</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><img src={Image_001} width="403" height="249"></img></td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left">
                            <strong>Note:</strong> Delta will search exact match in all the documents including alternate meaning of that<br/>
                            sentence and Abbreviations.</td>
                        </tr>
                        <tr>
                        <td colSpan="2" align="left">&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><strong>1.2 Partial Match</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left">By default, Delta uses Partial match syntax. The phrase can be searched without any special syntax.</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><strong>For Example:</strong> Synergy composer</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><img src={Image_002} width="600"></img></td>
                        </tr>
                        <tr>
                        <td colSpan="2" align="left">Delta will initially look for exact match. If no results are found, then it will look for partial match for any word in the search phrase. In this case, <strong>Synergy</strong> or <strong>Composer</strong>.</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left">&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="left"><strong>1.3 Search Particular column</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="2">If a particular column or a specific document should be searched, then “file:” for document and column name followed by the search string with double quotes.</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><strong>For Example: </strong> For Document search: <strong>file:”synergy composer”</strong><br/>
                            For Specific Column Search: <strong>title:”simplivity”</strong><br/>
                            (title is the column name)</td>
                        </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_003} width="600" /></td>
                    </tr>
                    <tr>
                        <td colSpan="2">Note: Here, column names <strong>(file, title, subject, keywords)</strong> should be <strong>in lower case</strong>.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>1.4 Adding Weightage to specific word</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2">If the weightage must be given to a specific work in the search phrase, mention the caret<br />
                        symbol (^) and weightage percent after the word.</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Example 1:</strong> Simplivity^2 installation^1<br/ >
                        <strong>Example 2:</strong> synergy^2 composer</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_004} width="600" /></td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong><h5>2 Advanced Search Features</h5></strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.1 Advanced Keyword Matching</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.1.1Search for a word (veeam) in a title field</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> file:veeam</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_005} width="600"/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.1.2 Search for a phrase (simplivity installation) in the title field</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> file:”simplivity installation”</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.1.3 Search a phrase (synergy composer) in the file field AND the phrase (“synergy”) in keywords field</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Example 1:</strong> file:”synergy composer” AND keywords:”synergy”<br />
                        <strong>Example 2:</strong> file:”synergy composer” OR keywords:”synergy”</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_007} width="600" /></td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.1.4 Search for either the phrase "battery failure" in the title field AND the phrase<br />
                        "DL380p" in the keywords field, or the word "UMC" in the title field.</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> (title:”battery failure” AND keywords:”DL380p”) OR title:”UMC”</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_008} width="555" height="210" /></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Note:</strong> Sentence should be enclosed in parentheses, when multiple conditions given.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.1.5 Search for word "synergy" and not "composer" in the title field.</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> file:synergy -file:composer</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_009} width="600"/></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Note:</strong> Space should be there between 2 title fields.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.2 Wildcard Matching</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.2.1 Search for any word starts with “simpli” in the title field.</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> file:simpli*</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_010} width="600" height="232"/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.2.2 Search for any words that starts with “synerg” and ends with “composer” in the title field</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> file:synerg* composer</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_011} width="600" height="auto"/></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Note: </strong>Note that Delta doesn't support using a * symbol as the first character of a search.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.3 Proximity Matching</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2">Searching words within a specific distance. Search for "synergy" within 2 words from each other.</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example:</strong> “synergy”~2</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_012} width="600" height=""/></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Note:</strong> For proximity searches, exact matches are proximity zero, and word transpositions<br/>
                        (battery fail) are proximity 1.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>2.4 Boosting Query</strong></td>
                    </tr>
                    <tr>
                        <td colSpan="2">Query-time boosts allow one to specify which terms/clauses are "more important". The higher the boost factor, the more relevant the term will be, and therefore the higher the corresponding document scores.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">A typical boosting technique is assigning higher boosts to title matches than to body content matches:</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>For Example: </strong>(file:synergy OR file:composer)^1.5 (keywords:simplivity OR title:veeam)</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img src={Image_013} width="600"/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2">&nbsp;</td>
                    </tr>


                        </tbody>
                        </table>
                    </div>
                        
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </Fragment>
      );
  };
}
export default Tips;