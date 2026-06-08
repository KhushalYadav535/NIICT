import React, { useEffect } from 'react';
import { X, Clock, Users, Star, CheckCircle, Award, Play, TrendingUp, Zap } from 'lucide-react';

const CourseModal = ({ isOpen, onClose, course }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{course.students}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span>{course.rating}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Course Image */}
          <div className="relative mb-6">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors">
                <Play size={24} />
              </button>
            </div>
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">About this course</h3>
            <p className="text-secondary">{course.description}</p>
          </div>

          {/* What You'll Learn */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">What You'll Learn</h3>
            <div className="space-y-2">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Highlights */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Course Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Certificate</h4>
                    <p className="text-sm text-secondary">Industry recognized</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Fast Track</h4>
                    <p className="text-sm text-secondary">Complete in {course.duration}</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Community</h4>
                    <p className="text-sm text-secondary">{course.students}+ students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div>
            {course.discount > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                <TrendingUp size={16} />
                <span>{course.discount}% OFF</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">₹{course.price.toLocaleString()}</div>
              {course.originalPrice && (
                <div className="text-lg text-secondary line-through">₹{course.originalPrice.toLocaleString()}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
            <button className="btn btn-primary">
              <span>Enroll Now</span>
              <Zap size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;