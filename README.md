1. Tech stacks:
- Node v 16.13.1
- Typescript
- Nest.js
- Jest
- Web3.js
2. Set up test environment
- 
- cd root folder
- npm install
- npm start for running
- npm test for testing
- End points:
  https://localhost:3000/game/player/:address
  https://localhost:3000/game/segment
- response type:
  success - {
    success: true,
    data: {}
  }
  error - {
    success: false,
    message: ''
  }
3. Test
- Game controller
  To be defined
  Get segment suceeds
  Get segment fails
  Get player info suceeds with correct address
  Get player info fails with non-player address
  Get player info fails with invalid address
- Game service
  To be defined
  Get player info suceeds with correct address
  Get player info fails with non-player address
  Current block timestamp is greater than zero
  First segment start timestamp is greater than zero
  Segment length is greater than zero