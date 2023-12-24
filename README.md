# Computer Architecure project

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description
Write an application program that illustrates/simulates the following workings of a computer system:

1. Cache Mapping Techniques
2. Microprogrammed Control Unit Implementation
3. Instruction Pipelining

PART I) Write an application program that implements Cache mapping techniques:

-  Direct Mapping
- Associative Mapping
- Set-Associative Mapping

Your program should (at least) do the following:

1.  Allow the user to select the mapping technique he/she wants to visualize
1.  Based on the technique selected, allow to visualize the cache content
1.  Generate a random word (requested by the processor) and make sure if it is in cache(hit) or not (miss)
1.  If hit, deliver to processor register. If miss, bring the word (a block containing the requested word) and deliver the word to the processor.
1. Cache should always hold a portion of main memory at any given time
1. Main memory content may be some randomly generated blocks of words.
1. If cache is full, allow the user to make decide which replacement technique to use.(Remember that in direct mapping that is not required).

PART II) Write an application program that implements microprogrammed control:
- Vertical implementation
- Horizontal implementation

Your program should (at least) do the following:

- Allow the user to select the implementation type
- The user provides the specifications of his processor
-  Number of registers
-  Number of supported ALU functions
-  An instruction to execute
-  Optionally, you may allow her/him to select the number of buses (3-, 2- or
1-bus organization)
- Show sequence of microoperations for the given instruction with their
corresponding time.
- Display the final control word (rows of bits representing the respective microoperations)

##### You may expand the application to support more features than stated. That would be a plus!

## License

This project is open source and available under the [MIT License](LICENSE).

