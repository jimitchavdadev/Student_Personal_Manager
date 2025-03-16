import { apiClient } from './apiClient';
import { Exam } from '../types/assignmentTypes';

interface ExamCreateData {
  subject_name: string;
  exam_date: string;
  what_to_study: string;
  resources: string[];
  userId: string;
}

class ExamService {
  private endpoint = '/exams';

  async getExams(userId: string): Promise<Exam[]> {
    const response = await apiClient.get(`${this.endpoint}?userId=${userId}`);
    return response.map(this.mapExamResponse);
  }

  async createExam(examData: ExamCreateData): Promise<Exam> {
    const response = await apiClient.post(this.endpoint, examData);
    return this.mapExamResponse(response);
  }

  async updateExam(id: string, examData: Partial<ExamCreateData>): Promise<Exam> {
    const response = await apiClient.patch(`${this.endpoint}/${id}`, examData);
    return this.mapExamResponse(response);
  }

  async deleteExam(id: string, userId: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}?userId=${userId}`);
  }

  private mapExamResponse(exam: any): Exam {
    return {
      id: exam._id,
      subject_name: exam.subject_name,
      exam_date: exam.exam_date,
      what_to_study: exam.what_to_study,
      resources: exam.resources
    };
  }
}

export const examService = new ExamService();