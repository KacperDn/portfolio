export interface JourneyStep {
  id: string
  title: string
  text: string
}

export const journeySteps: JourneyStep[] = [
  {
    id: 'vue',
    title: 'Vue and TypeScript',
    text: 'Every request starts in the browser. I build the interface in Vue and TypeScript.'
  },
  {
    id: 'rest',
    title: 'REST',
    text: 'The interface talks to the backend over REST. At work I build and integrate these APIs.'
  },
  {
    id: 'gate',
    title: 'Validation and auth',
    text: 'Both run before any logic. Input that does not fit is rejected here, with a 422.'
  },
  {
    id: 'controller',
    title: 'Controller',
    text: 'In Symfony the controller stays thin: it takes the request and hands it on.'
  },
  {
    id: 'service',
    title: 'Service',
    text: 'Business logic lives in the service layer, not in the controller.'
  },
  {
    id: 'ai',
    title: 'AI',
    text: 'A daily tool beside the flow, not in it. It speeds me up, and I read and understand what ends up in my code.'
  },
  {
    id: 'dto',
    title: 'DTO',
    text: 'Data crosses layers as DTOs with explicit types, not loose arrays.'
  },
  {
    id: 'db',
    title: 'Database',
    text: 'The request ends where the data lives. TODO: name the database and ORM.'
  },
  {
    id: 'wordpress',
    title: 'WordPress',
    text: 'Sites for clients, shipped and live.'
  }
]
