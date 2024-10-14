## Mini Framework

#### Overview

Mini Framework is a lightweight library designed to facilitate the creation and manipulation of a Virtual DOM (VDOM) representation of HTML structures. It introduces a central object named framework, which plays a crucial role in managing and updating the application's user interface. This object maintains the connection between the VDOM and the actual DOM, ensuring a smooth and responsive user experience.
Framework Structure

To effectively utilize Mini Framework, the framework object should be structured in the following manner:

let framework = {
customKey: customValue,
rootEl: undefined,
obj: undefined
};

The obj and rootEl keys are initially set to undefined. These keys are vital for preserving the link between the VDOM and the real DOM.

## Function: MINI.tag[HTMLElement]

The MINI.tag[HTMLElement] function generates a VDOM representation of an HTML element.
Syntax

MINI.tag[HTMLElement](attributes = {}, eventHandlers = {}, properties = {}, ...children)

or

MINI.tag.HTMLElement(attributes = {}, eventHandlers = {}, properties = {}, ...children)

Here, HTMLElement is the desired HTML tag. For state-related scenarios, refer to the provided examples.
Parameters

- attributes (optional): An object representing the element's attributes. Attribute names are keys, and their values are corresponding values.
- eventHandlers (optional): An object for event handlers attached to the element. Event names are keys, and the event handler functions are values.
- properties (optional): An object representing the element's properties. Property names are keys, and their values are corresponding values.
- ...children (optional): Any number of child elements for the HTML element.

## Return Value

Returns an object representing the VDOM for the specified HTML element, containing:

- tag: The HTML element's tag.
- attrs: An object with the element's attributes.
- property: An object with the element's event handlers and properties.
- children: An array of the element's child elements.

## Custom Methods

The created element object offers several custom methods for element manipulation:

- setTag(newTag): Updates the element's tag name.
- setAttr(key, val): Adds or modifies an attribute of the element.
- removeAttr(key, val, replaceVal): Removes or alters an attribute of the element.
- setProp(key, val): Adds or modifies a property of the element.
- removeProp(key, val): Removes or alters a property of the element.
- setChild(...obj): Adds child elements or text nodes to the element.
- removeChildren(index, deleteCount): Removes a range of children from the element.
- copy(): Creates a deep copy of the element and its children.

## Function: MINI.createNode()

The MINI.createNode() function generates a real DOM node based on a VDOM object returned by MINI.tag.

Syntax
MINI.createNode(obj)

Parameters

    obj: The VDOM object representing an HTML element, containing:
        -tag: The HTML element's tag name.
        -attrs (optional): An object with the element's attributes.
        -property (optional): An object with the element's properties.
        -children (optional): An array of child elements or strings as text content.

Return Value

Returns an object or an array of objects that match the search criteria, representing a match found in the provided obj. If no matches are found, an empty array is returned.

## Function: MINI.getObjByAttrsAndPropVal()

This recursive utility function searches for objects within a given object hierarchy based on attribute and property values.
Syntax
MINI.getObjByAttrsAndPropVal(obj, value)

Parameters

    -obj: The object to search within. It should follow the format returned by MINI.tag or have a similar structure.
    -value: The value to search for within the attributes or properties of the objects.

Returned Value

    Returns an object or an array of objects that match the search criteria, representing a match found in the provided obj. If no matches are found, an empty array is returned.

## Function: MINI.getObjByTag()

This function searches for objects within a nested object structure based on a specific value in their tag.
Syntax
MINI.getObjByTag(obj, value)

Parameters

    -obj: The object to search within. It should follow the format returned by MINI.tag or have a similar structure.
    -value: The value to search for within the tag of the objects.

Returned Value

    Returns the first element as an array (result) containing the objects with the specified value in their tag.
    The second element is a deep copy of the result array.

## Function: MINI.update(obj)

The update() function refreshes the current VDOM with a modified VDOM when state changes occur and applies those changes to the real DOM.
Syntax
MINI.update(obj)

Parameters

    obj: The modified nested object representing the HTML structure.
