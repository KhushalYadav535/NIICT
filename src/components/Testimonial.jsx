import React from 'react';
 import student1 from '../assets/sst.jpg'
import student2 from '../assets/sst3.jpg';
import student3 from '../assets/sst4.jpg';
// import student3 from '../assets/student3.jpg';

function Testimonial() {
  const testimonials = [
    {
      name: "Amit Kumar",
      message: "NIICT has transformed my career! The courses are top-notch and the instructors are very knowledgeable.",
     image: student1,
    },
    {
      name: "Sunil ",
      message: "I gained practical skills that helped me land my dream job. Highly recommend NIICT!",
      image: student2,
    },
    {
    name: "Abhishek",
      message: "The learning environment is fantastic, and the support from the staff is exceptional.",
     image: student3,
    },
  ];

  return (
    <section className="testimonial">
      <h2>What Our Students Say</h2>
      <div className="testimonial-grid">
        <div className="testimonial-items">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-item" key={index}>
              <p>"{testimonial.message}"</p>
              <h4>- {testimonial.name}</h4>
            </div>
          ))}
        </div>
        <div className="student-images">
          {testimonials.map((testimonial, index) => (
            <img
              key={index}
              src={testimonial.image}
              alt={testimonial.name}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;