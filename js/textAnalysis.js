// Text analysis functionality (Q3)

// Comprehensive lists for text analysis
const textAnalysisLists = {
    // Pronouns categorized by type - exhaustive list
    pronouns: {
        personal: [
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            'ye', 'thou', 'thee', 'thy', 'thine', 'thyself' // Archaic forms
        ],
        possessive: [
            'my', 'mine', 'your', 'yours', 'his', 'her', 'hers', 'its', 'our', 'ours', 'their', 'theirs',
            'thy', 'thine' // Archaic forms
        ],
        reflexive: [
            'myself', 'yourself', 'yourselves', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
            'thyself', 'oneself'
        ],
        demonstrative: [
            'this', 'that', 'these', 'those', 'such', 'yonder'
        ],
        interrogative: [
            'who', 'whom', 'whose', 'which', 'what', 'whoever', 'whomever', 'whichever', 'whatever',
            'whensoever', 'whoso', 'whosoever'
        ],
        relative: [
            'who', 'whom', 'whose', 'which', 'that', 'what', 'whoever', 'whomever', 'whichever', 'whatever'
        ],
        indefinite: [
            'anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'everyone', 
            'everything', 'neither', 'nobody', 'no one', 'nothing', 'one', 'somebody', 
            'someone', 'something', 'both', 'few', 'many', 'several', 'all', 'any', 
            'most', 'none', 'some', 'enough', 'other', 'others', 'another', 'certain',
            'plenty', 'more', 'much', 'little', 'less', 'least', 'no', 'various', 
            'sundry', 'diverse', 'divers', 'whatsoever', 'whosoever', 'whomsoever', 
            'wheresoever', 'whichsoever', 'whenever', 'wherever', 'whomever', 'whatever',
            'whatnot', 'whoso', 'whomso', 'somewhat'
        ],
        reciprocal: [
            'each other', 'one another'
        ]
    },
    
    // Prepositions categorized by type - exhaustive list
    prepositions: {
        simple: [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'amidst', 'among', 'amongst', 'around', 
            'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'betwixt', 'beyond', 
            'but', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'except', 'excepting', 'excluding',
            'following', 'for', 'from', 'in', 'including', 'inside', 'into', 'like', 'mid', 'minus', 'near', 
            'next', 'notwithstanding', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over', 
            'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'throughout', 
            'till', 'times', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'unto', 
            'up', 'upon', 'versus', 'via', 'with', 'within', 'without', 'worth'
        ],
        compound: [
            'according to', 'ahead of', 'along with', 'apart from', 'as for', 'as of', 'as per', 'as regards', 
            'aside from', 'as well as', 'because of', 'by means of', 'close to', 'contrary to', 'due to', 
            'except for', 'far from', 'for the sake of', 'in accordance with', 'in addition to', 'in case of', 
            'in front of', 'in lieu of', 'in place of', 'in point of', 'in regard to', 'in respect to', 
            'in spite of', 'instead of', 'in terms of', 'in view of', 'irrespective of', 'near to', 
            'next to', 'on account of', 'on behalf of', 'on top of', 'opposite to', 'out of', 'outside of',
            'owing to', 'prior to', 'pursuant to', 'regardless of', 'relative to', 'subsequent to', 
            'thanks to', 'up against', 'up to', 'with reference to', 'with regard to', 'with respect to',
            'by virtue of', 'in the light of', 'with a view to', 'in relation to', 'as a result of',
            'by reason of', 'for fear of', 'for lack of', 'for the purpose of', 'in comparison with',
            'in exchange for', 'in favor of', 'on the basis of', 'on the grounds of', 'on the part of',
            'with the exception of'
        ]
    },
    
    // Indefinite articles - exhaustive list
    indefiniteArticles: [
        'a', 'an'
    ]
};

// Function to analyze text (case-insensitive)
function analyzeText(text) {
    // Basic text metrics
    const metrics = {
        letters: 0,
        words: 0,
        spaces: 0,
        newlines: 0,
        specialSymbols: 0
    };
    
    // Count basic metrics
    metrics.letters = (text.match(/[a-zA-Z]/g) || []).length;
    metrics.words = text.trim().split(/\s+/).length;
    metrics.spaces = (text.match(/[ ]/g) || []).length;
    metrics.newlines = (text.match(/\n/g) || []).length;
    metrics.specialSymbols = (text.match(/[^\w\s\n]/g) || []).length;
    
    // Convert all text to lowercase for case-insensitive matching
    const lowercaseText = text.toLowerCase();
    
    // Tokenize the text (split by spaces and punctuation)
    const tokens = lowercaseText
                      .replace(/[^\w\s]|_/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
                      .split(' ');
    
    // Initialize result objects for word categories
    const pronounCounts = {};
    const prepositionCounts = {};
    const articleCounts = {};
    
    // Process each token (case-insensitive)
    tokens.forEach(token => {
        // Skip empty tokens
        if (!token) return;
        
        // Check pronouns
        for (const [type, pronounsList] of Object.entries(textAnalysisLists.pronouns)) {
            if (pronounsList.includes(token)) {
                pronounCounts[token] = (pronounCounts[token] || 0) + 1;
            }
        }
        
        // Check simple prepositions
        if (textAnalysisLists.prepositions.simple.includes(token)) {
            prepositionCounts[token] = (prepositionCounts[token] || 0) + 1;
        }
        
        // Check indefinite articles
        if (textAnalysisLists.indefiniteArticles.includes(token)) {
            articleCounts[token] = (articleCounts[token] || 0) + 1;
        }
    });
    
    // Check for compound prepositions in original text (case-insensitive)
    textAnalysisLists.prepositions.compound.forEach(compoundPrep => {
        const regex = new RegExp('\\b' + compoundPrep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
        const matches = text.match(regex);
        
        if (matches && matches.length > 0) {
            prepositionCounts[compoundPrep] = matches.length;
        }
    });
    
    // Check for multi-word pronouns in original text (case-insensitive)
    const multiWordPronouns = [
        ...textAnalysisLists.pronouns.reciprocal,
        ...textAnalysisLists.pronouns.indefinite.filter(p => p.includes(' '))
    ];
    
    multiWordPronouns.forEach(pronoun => {
        const regex = new RegExp('\\b' + pronoun.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
        const matches = text.match(regex);
        
        if (matches && matches.length > 0) {
            pronounCounts[pronoun] = matches.length;
        }
    });
    
    return {
        metrics,
        pronounCounts,
        prepositionCounts,
        articleCounts
    };
}

// Function to generate HTML for the analysis results - improved UI
function generateAnalysisHTML(analysis) {
    let html = '<div class="analysis-results">';
    
    // Basic metrics
    html += '<div class="metrics-section">';
    html += '<h3>Basic Text Metrics</h3>';
    html += '<div class="metrics-grid">';
    html += `<div class="metric-item"><span class="metric-label">Letters:</span> <span class="metric-value">${analysis.metrics.letters}</span></div>`;
    html += `<div class="metric-item"><span class="metric-label">Words:</span> <span class="metric-value">${analysis.metrics.words}</span></div>`;
    html += `<div class="metric-item"><span class="metric-label">Spaces:</span> <span class="metric-value">${analysis.metrics.spaces}</span></div>`;
    html += `<div class="metric-item"><span class="metric-label">Newlines:</span> <span class="metric-value">${analysis.metrics.newlines}</span></div>`;
    html += `<div class="metric-item"><span class="metric-label">Special Symbols:</span> <span class="metric-value">${analysis.metrics.specialSymbols}</span></div>`;
    html += '</div></div>';
    
    // Pronouns
    html += '<div class="token-section">';
    html += '<h3>Pronouns</h3>';
    html += '<div class="token-counts">';
    if (Object.keys(analysis.pronounCounts).length === 0) {
        html += '<p class="no-results">No pronouns found</p>';
    } else {
        Object.entries(analysis.pronounCounts)
            .sort(([, a], [, b]) => b - a)
            .forEach(([pronoun, count]) => {
                html += `<div class="token-item"><span class="token">${pronoun}</span> <span class="count">${count}</span></div>`;
            });
    }
    html += '</div></div>';
    
    // Prepositions
    html += '<div class="token-section">';
    html += '<h3>Prepositions</h3>';
    html += '<div class="token-counts">';
    if (Object.keys(analysis.prepositionCounts).length === 0) {
        html += '<p class="no-results">No prepositions found</p>';
    } else {
        Object.entries(analysis.prepositionCounts)
            .sort(([, a], [, b]) => b - a)
            .forEach(([preposition, count]) => {
                html += `<div class="token-item"><span class="token">${preposition}</span> <span class="count">${count}</span></div>`;
            });
    }
    html += '</div></div>';
    
    // Indefinite Articles
    html += '<div class="token-section">';
    html += '<h3>Indefinite Articles</h3>';
    html += '<div class="token-counts">';
    if (Object.keys(analysis.articleCounts).length === 0) {
        html += '<p class="no-results">No indefinite articles found</p>';
    } else {
        Object.entries(analysis.articleCounts)
            .sort(([, a], [, b]) => b - a)
            .forEach(([article, count]) => {
                html += `<div class="token-item"><span class="token">${article}</span> <span class="count">${count}</span></div>`;
            });
    }
    html += '</div></div>';
    
    html += '</div>';
    return html;
}

// Initialize text analysis UI
function initTextAnalysis() {
    const textAnalysisPanel = document.getElementById('panel-content-3');
    if (!textAnalysisPanel) return;
    
    // Create UI elements with improved UI
    const analysisUI = `
        <div class="text-analysis-container">
            <div class="input-section">
                <h3>Text Analysis Tool</h3>
                <p class="input-instructions">Enter or paste text below to analyze language patterns and metrics.</p>
                <textarea id="text-input" placeholder="Paste or type your text here..." rows="10"></textarea>
                <div class="button-container">
                    <button id="analyze-button" class="analyze-btn">
                        <i class="fas fa-chart-bar"></i> Analyze Text
                    </button>
                    <button id="clear-button" class="clear-btn">
                        <i class="fas fa-eraser"></i> Clear
                    </button>
                </div>
            </div>
            <div id="analysis-results" class="results-section">
                <p class="intro-text">Analysis results will appear here after you analyze text.</p>
            </div>
        </div>
    `;
    
    // Add UI to panel
    textAnalysisPanel.innerHTML = analysisUI;
    
    // Add event listener to the analyze button
    document.getElementById('analyze-button').addEventListener('click', function() {
        const text = document.getElementById('text-input').value;
        
        if (text.trim().length === 0) {
            document.getElementById('analysis-results').innerHTML = '<p class="error">Please enter some text to analyze.</p>';
            return;
        }
        
        // Perform the analysis
        const analysis = analyzeText(text);
        
        // Display the results
        document.getElementById('analysis-results').innerHTML = generateAnalysisHTML(analysis);
    });
    
    // Add event listener to the clear button
    document.getElementById('clear-button').addEventListener('click', function() {
        document.getElementById('text-input').value = '';
        document.getElementById('analysis-results').innerHTML = '<p class="intro-text">Analysis results will appear here after you analyze text.</p>';
    });
}

export { initTextAnalysis, analyzeText };