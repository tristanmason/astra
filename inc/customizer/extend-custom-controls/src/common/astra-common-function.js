
export default function testJSON(text) { 
    if (typeof text !== "string") { 
        return false; 
    } 
    try { 
        JSON.parse(text); 
        return true; 
    } catch (error) { 
        return false; 
    } 
}