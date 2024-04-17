import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqList = [
    { question: 'How does the order tracker app work?', answer: 'The order tracker app works by...' },
    { question: 'Can I track orders from multiple websites using this app?', answer: 'Yes, you can track orders from multiple websites...' },
    { question: 'Is the app compatible with all e-commerce platforms?', answer: 'The app is compatible with most major e-commerce platforms...' },
    { question: 'How do I add orders to track within the app?', answer: 'You can add orders to track by...' },
    { question: 'What information do I need to input to track an order?', answer: 'To track an order, you need to input...' },
    { question: 'Can I receive notifications for order updates?', answer: 'Yes, you can set up notifications for order updates...' },
    { question: 'How frequently does the app update order statuses?', answer: 'The app updates order statuses...' },
    { question: 'Is the app secure? How is my order information protected?', answer: 'The app takes security seriously...' },
    { question: 'Can I track orders internationally with this app?', answer: 'Yes, you can track international orders...' },
    { question: 'What happens if there\'s an issue with an order? Does the app provide any support or assistance?', answer: 'If there\'s an issue with an order, you can...' },
  ];
}