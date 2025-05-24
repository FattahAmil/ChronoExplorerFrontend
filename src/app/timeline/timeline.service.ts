import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimelineData, HistoricalPeriod, HistoricalEvent, ThematicGroup } from './timeline.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  private mockData: TimelineData = {
    periods: [
      { id: 'p1', name: 'Ancient Times', startDate: '0001-01-01', endDate: '0500-12-31', color: '#FFD700' },
      { id: 'p2', name: 'Middle Ages', startDate: '0501-01-01', endDate: '1500-12-31', color: '#C0C0C0' },
      { id: 'p3', name: 'Modern Era', startDate: '1501-01-01', endDate: new Date().toISOString().split('T')[0], color: '#ADD8E6' }
    ],
    events: [
      {
        id: 'e1',
        date: '0070-01-01',
        title: 'Colosseum Construction Begins',
        summary: 'Construction of the Flavian Amphitheatre (Colosseum) starts in Rome.',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Colosseum', // Added
        periodId: 'p1',
        detailedDescription: 'The Colosseum, an iconic symbol of Imperial Rome, was built by the Flavian emperors as a gift to the Roman people. Its construction began under Vespasian in AD 72 and was completed in AD 80 under his successor and heir, Titus.',
        sources: [{ name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Colosseum' }],
        media: [{ type: 'image', url: 'colosseum.jpg', description: 'The Colosseum in Rome' }]
      },
      {
        id: 'e2',
        date: '0476-09-04',
        title: 'Fall of the Western Roman Empire',
        summary: 'Odoacer deposes Romulus Augustulus, marking the traditional end of the Western Roman Empire.',
        periodId: 'p1',
        detailedDescription: 'The deposition of Romulus Augustulus by Odoacer, a Germanic chieftain, is widely cited as the end of the Western Roman Empire. This event marked the beginning of the Middle Ages in Western Europe.',
        sources: [{ name: 'Britannica', url: 'https://www.britannica.com/event/Fall-of-Rome' }]
      },
      {
        id: 'e3',
        date: '1066-10-14',
        title: 'Battle of Hastings',
        summary: 'The Norman forces of William the Conqueror defeat the English forces of King Harold Godwinson.',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Battle+of+Hastings', // Added
        periodId: 'p2',
        groupIds: ['g1'],
        detailedDescription: 'The Battle of Hastings was fought on 14 October 1066 between the Norman-French army of William, Duke of Normandy, and an English army under the Anglo-Saxon King Harold Godwinson, beginning the Norman conquest of England.',
        media: [{ type: 'image', url: 'battle_hastings.jpg', description: 'Bayeux Tapestry depiction of the Battle of Hastings'}]
      },
      {
        id: 'e4',
        date: '1492-10-12',
        title: 'Columbus Reaches the Americas',
        summary: 'Christopher Columbus, sailing for Spain, makes his first landing in the New World.',
        periodId: 'p2',
        groupIds: ['g2'],
        detailedDescription: 'Christopher Columbus\'s first voyage to the Americas in 1492 is a pivotal moment in world history, marking the beginning of sustained European contact with the Americas.',
        sources: [{ name: 'History.com', url: 'https://www.history.com/this-day-in-history/columbus-reaches-the-new-world' }]
      },
      {
        id: 'e5',
        date: '1776-07-04',
        title: 'US Declaration of Independence',
        summary: 'The Continental Congress adopts the Declaration of Independence, declaring the thirteen American colonies independent from Great Britain.',
        periodId: 'p3',
        groupIds: ['g1', 'g2'],
        detailedDescription: 'The United States Declaration of Independence is the pronouncement adopted by the Second Continental Congress meeting in Philadelphia, Pennsylvania, on July 4, 1776. The Declaration explained why the Thirteen Colonies at war with the Kingdom of Great Britain regarded themselves as thirteen independent sovereign states, no longer under British rule.',
        media: [{ type: 'video', url: 'declaration_reading.mp4', description: 'Dramatic reading of the Declaration'}]
      }
    ],
    groups: [
      { id: 'g1', name: 'Warfare & Conquests', description: 'Events related to significant battles, wars, and conquests throughout history.' },
      { id: 'g2', name: 'Exploration & Discovery', description: 'Events marking significant explorations and discoveries of new lands or knowledge.' }
    ]
  };

  constructor() { }

  public getTimelineData(): Observable<TimelineData> {
    return of(this.mockData);
  }
}
