// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Tendery {
    uint16 constant MAX_ANSWER_LENGTH = 280;

    struct Answer {
        uint256 id;
        address author;
        string content;
        string kodePertanyaan;
    }

    mapping(address => Answer[]) public answers;
    event AnswerCreated(uint256 id, address author, string content, string kodePertanyaan);

    function createAnswer(string memory _kodePertanyaan, string memory _answer) public {
        require(bytes(_answer).length <= MAX_ANSWER_LENGTH, "Answer is too long!");

        Answer memory newAnswer = Answer({
            id: answers[msg.sender].length,
            author: msg.sender,
            kodePertanyaan: _kodePertanyaan,
            content: _answer
            
        });

        answers[msg.sender].push(newAnswer);
        emit AnswerCreated(newAnswer.id, newAnswer.author, newAnswer.content, newAnswer.kodePertanyaan);
    }

    function getAnswer(uint _i) public view returns (Answer memory) {
        return answers[msg.sender][_i];
    }

    function getAllAnswers(address _owner) public view returns (Answer[] memory) {
        return answers[_owner];
    }
}
